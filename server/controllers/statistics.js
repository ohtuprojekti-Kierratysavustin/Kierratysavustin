const statisticsRouter = require('express').Router()
const ProductUserCounter = require('../models/productUserCounter')
const authUtils = require('../utils/auth')
const STATUS_CODES = require('http-status')
const { restructureCastAndValidationErrorsFromMongoose } = require('../error/exceptions')
const ObjectID = require('mongodb').ObjectID
const { startOfDay, endOfDay } = require('date-fns')
const { tryCastToInteger } = require('../utils/validation')

statisticsRouter.get('/', async (req, res, next) => { // osoitteeksi '/user/stats'
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)

    const aggCursor = await ProductUserCounter.collection.aggregate([
      {
        // Rajataan haku kirjautuneen käyttäjän tietoihin
        $match: { 'userID': new ObjectID(user.id) }
      },
      {
        // Ryhmitellään tuotteittain ja lasketaan summat hankinnoille ja kierrätyksille
        $group: {
          _id: '$productID',
          'purchaseCount':  { $sum: '$purchaseCount' },
          'recycleCount':  { $sum: '$recycleCount' },
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

    res.status(STATUS_CODES.OK).json(aggCursor)
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    next(handledError)
  } 
})

//Palauttaa taulukon, osoiterivillä kyselyssä annetaan päivien määrä
statisticsRouter.get('/user/table', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)

    let amount = tryCastToInteger(req.query.numOfDays, 'Päivien lukumäärän on oltava kokonaisluku! Annettiin {value}', 'amount')

    let numOfDays = amount
    let baselineStart = 365 // Miltä ajalta tilastoja lasketaan lähtöpisteelle
    let today = new Date()

    let baselineStartDate = new Date()
    baselineStartDate.setDate(today.getDate() - baselineStart)
    let baselineEndDate = new Date()
    baselineEndDate.setDate(today.getDate() - numOfDays)

    let baselineSums = await getCountsFrom(user, baselineStartDate, baselineEndDate)

    let totalPurchases = baselineSums[0].purchaseCount
    let totalRecycles = baselineSums[0].recycleCount
    let dailyRecyclingrateTable = new Array

    for (let i=1; i<=numOfDays; i++) {
      let day = new Date()
      day.setDate(day.getDate() - (numOfDays - i))
      let dailyValues = await getCountsFrom(user, day, day)

      totalPurchases +=  dailyValues[0] ? dailyValues[0].purchaseCount : 0
      totalRecycles += dailyValues[0] ? dailyValues[0].recycleCount : 0

      let totalRecyclingRate = totalRecycles === 0 ? 0 : totalRecycles / totalPurchases
      dailyRecyclingrateTable.push(totalRecyclingRate)
    }
    console.log('kokonaiskierrätysaste:', dailyRecyclingrateTable.toString())

    res.status(STATUS_CODES.OK).json(dailyRecyclingrateTable)
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    next(handledError)
  } 
})


async function getCountsFrom(user, startDate, endDate) {
  const dailyValues = await ProductUserCounter.collection.aggregate([
    {
      // Rajataan haku kirjautuneen käyttäjän tietoihin
      $match: { 
        'userID': new ObjectID(user.id),
        createdAt: {
          $gte: startOfDay(startDate),
          $lte: endOfDay(endDate)
        },
      },
    },
    {
      // Ryhmitellään tuotteittain ja lasketaan summat hankinnoille ja kierrätyksille
      $group: {
        _id: '$userID',
        'purchaseCount':  { $sum: '$purchaseCount' },
        'recycleCount':  { $sum: '$recycleCount' },
      }
    },
  ]).toArray()

  return dailyValues
}

module.exports = statisticsRouter