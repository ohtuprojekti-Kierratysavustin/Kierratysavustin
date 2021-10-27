const statisticsRouter = require('express').Router()
const ProductUserCounter = require('../models/productUserCounter')
const authUtils = require('../utils/auth')
const STATUS_CODES = require('http-status')
const { restructureCastAndValidationErrorsFromMongoose, InvalidParameterException } = require('../error/exceptions')
const ObjectID = require('mongodb').ObjectID
const { isValid, fromUnixTime, addDays, subDays, differenceInCalendarDays, endOfDay, startOfDay } = require('date-fns')

// Palauttaa käyttäjän kierrätystilaston
statisticsRouter.get('/user/recyclingratesperproduct', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)
    let today = new Date()
    let aYearAgo = subDays(today, 365) // kuinka kaukaa tietoja haetaan
    const eventsPerProduct = await getRecyclingRatesPerProductUpToDate(user, startOfDay(aYearAgo), endOfDay(today))

    res.status(STATUS_CODES.OK).json(eventsPerProduct)
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    next(handledError)
  }
})

// Palauttaa taulukon käyttäjän päivittäisistä kokonaiskierrätysasteista, kyselyn osoiterivillä annettujen päivien väliltä
statisticsRouter.get('/user/recyclingratesperday', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)

    let startDate = fromUnixTime(req.query.start/1000)
    let endDate = fromUnixTime(req.query.end/1000)

    if (!isValid(startDate) || !isValid(endDate) ) {
      throw new InvalidParameterException(
        'Kyselyn parametrit on ilmoitettava unix-aikaleimoina. Annettiin \'' + req.query.start + '\' ja \'' + req.query.end + '\'')
    }

    if (startDate > endDate){
      throw new InvalidParameterException(
        'Kyselyn alkupäivämäärän on oltava pienempi kun loppupäivämäärän. Annettiin \'' + startDate + '\' ja \'' + endDate + '\'')
    }

    const period = differenceInCalendarDays(endDate, startDate) + 1 // yksi päivä lisää, jotta saadaan päivien määrä
    let dailyRecyclingrateTable = new Array
    let requestedDay = subDays(endDate, period)
    
    for (let i=0; i<=period; i++) {
      let dailyValuesPerProduct = await getRecyclingRatesPerProductUpToDate(user, startOfDay(startDate), endOfDay(requestedDay))
      
      let totalPurchases = 0
      let totalRecycles = 0
      for (let i=0; i<dailyValuesPerProduct.length; i++) {
        totalPurchases += dailyValuesPerProduct[i].purchaseCount
        totalRecycles += dailyValuesPerProduct[i].recycleCount
      }
      
      let totalRecyclingRate = (totalRecycles === 0) ? 0 : totalRecycles / totalPurchases * 100
      dailyRecyclingrateTable.push(totalRecyclingRate)
      requestedDay = addDays(requestedDay, 1)
    }

    res.status(STATUS_CODES.OK).json(dailyRecyclingrateTable)
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    next(handledError)
  } 
})

async function getRecyclingRatesPerProductUpToDate(user, afterDate, beforeDate) {
  const eventsPerProduct = await ProductUserCounter.collection.aggregate([
    {
      // Rajataan haku kirjautuneen käyttäjän tietoihin
      $match: { 
        'userID': new ObjectID(user.id),
        // Rajataan viimeisimpiin tapahtumiin, tai niihin joista aikaleima puuttuu
        $or: [
          {'createdAt': { $gte: afterDate, $lte: beforeDate } },
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
  return eventsPerProduct
}

module.exports = statisticsRouter