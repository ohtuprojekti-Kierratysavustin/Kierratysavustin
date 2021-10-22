const statisticsRouter = require('express').Router()
const ProductUserCounter = require('../models/productUserCounter')
const authUtils = require('../utils/auth')
const STATUS_CODES = require('http-status')
const { restructureCastAndValidationErrorsFromMongoose } = require('../error/exceptions')
const ObjectID = require('mongodb').ObjectID
const { startOfDay, endOfDay } = require('date-fns')

statisticsRouter.get('/', async (req, res, next) => {
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




    let numOfDays = 30
    let baselineStart = 365
    let today = new Date()

    let baselineStartDate = new Date()
    baselineStartDate.setDate(today.getDate() - baselineStart)
    let baselineEndDate = new Date()
    baselineEndDate.setDate(today.getDate() - numOfDays)

    let baseLine = await getCountsFrom(user, baselineStartDate, baselineEndDate)

    let totalPurchases = baseLine[0].purchaseCount
    let totalRecycles = baseLine[0].recycleCount

    for (let i=1; i<=numOfDays; i++) {
      let day = new Date()
      day.setDate(day.getDate() - (numOfDays - i))
      let dailyValues = await getCountsFrom(user, day, day)

      totalPurchases +=  dailyValues[0] ? dailyValues[0].purchaseCount : 0
      totalRecycles += dailyValues[0] ? dailyValues[0].recycleCount : 0

      let totalRecyclingRate = totalRecycles === 0 ? 0 : totalRecycles / totalPurchases
      console.log('kokonaiskierrätysaste:', totalRecyclingRate)
    }



    res.status(STATUS_CODES.OK).json(aggCursor)
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    next(handledError)
  } 
})

async function getCountsFrom(user, startDate, endDate) {
  console.log('start ', startDate, ' end', endDate)
  const aggCursor2 = await ProductUserCounter.collection.aggregate([
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

  console.log(aggCursor2)
  return aggCursor2
}

module.exports = statisticsRouter