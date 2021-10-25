const statisticsRouter = require('express').Router()
const ProductUserCounter = require('../models/productUserCounter')
const authUtils = require('../utils/auth')
const STATUS_CODES = require('http-status')
const { restructureCastAndValidationErrorsFromMongoose, InvalidParameterException } = require('../error/exceptions')
const ObjectID = require('mongodb').ObjectID
const { tryCastToInteger } = require('../utils/validation')

// Palauttaa käyttäjän kierrätystilaston
statisticsRouter.get('/', async (req, res, next) => { // osoitteeksi '/user/stats'
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)
    let today = new Date()
    const eventsPerProduct = await getRecyclingRatesPerProductUntilDate(user, today)

    res.status(STATUS_CODES.OK).json(eventsPerProduct)
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    next(handledError)
  }
})

// Palauttaa taulukon, osoiterivillä kyselyssä annetaan päivien määrä
statisticsRouter.get('/user/table', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)

    let amount = tryCastToInteger(req.query.numOfDays, 'Päivien lukumäärän on oltava kokonaisluku! Annettiin {value}', 'amount')

    if (amount < 0) {
      throw new InvalidParameterException(
        'Kyselyn parametrin on oltava positiivinen kokonaisluku. Annettiin \'' + amount + '\'')
    }

    let numOfDays = amount
    let today = new Date()
    let dailyRecyclingrateTable = new Array

    for (let i=1; i<=numOfDays; i++) {
      let day = new Date()
      day.setDate(today.getDate() - (numOfDays - i))
      let dailyValues = await getRecyclingRatesPerProductUntilDate(user, day)
      let totalPurchases = 0
      let totalRecycles = 0

      for (let i=0; i<dailyValues.length; i++) {
        totalPurchases += dailyValues[i].purchaseCount
        totalRecycles += dailyValues[i].recycleCount
      }

      let totalRecyclingRate = (totalRecycles === 0) ? 0 : totalRecycles / totalPurchases
      dailyRecyclingrateTable.push(totalRecyclingRate)
    }

    //console.log('kokonaiskierrätysaste:', dailyRecyclingrateTable.toString())

    res.status(STATUS_CODES.OK).json(dailyRecyclingrateTable)
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    next(handledError)
  } 
})

async function getRecyclingRatesPerProductUntilDate(user, date) {
  const eventsPerProduct = await ProductUserCounter.collection.aggregate([
    {
      // Rajataan haku kirjautuneen käyttäjän tietoihin
      $match: { 
        'userID': new ObjectID(user.id),
        // Rajataan viimeisimpiin tapahtumiin, tai niihin joista aikaleima puuttuu
        $or: [
          {'createdAt': { $lte: date } },
          {'createdAt': { $exists: false } }
        ]
      }
    },
    {
      // Ryhmitellään tuotteittain ja haetaan viimeisimmät tiedot hankinnoille ja kierrätyksille
      $group: {
        _id: '$productID',
        'purchaseCount':  { $last: '$purchaseCount' },
        'recycleCount':  { $last: '$recycleCount' },
        //'createdAt': { $last: '$createdAt' },
      }
    },
    {
      $sort: {
        'createdAt': -1
      }
    },
    {
      // Haetaan tuotteen tiedot taulusta products
      $lookup: {
        from: 'products', 
        localField: '_id',
        foreignField: '_id',
        as: 'productID'
      }
    },
    {
      // Puretaan tuotteen tiedot kentiksi
      $unwind: '$productID'
    },
    {
      // Lisätään kenttä 'id' tuotteen tietoihin
      $addFields: { productID: { 'id': '$_id'} }
    },
  ]).toArray()
  //console.log(eventsPerProduct)
  return eventsPerProduct
}

module.exports = statisticsRouter