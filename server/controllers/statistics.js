const statisticsRouter = require('express').Router()
const ProductUserCounter = require('../models/productUserCounter')
const authUtils = require('../utils/auth')
const STATUS_CODES = require('http-status')
const { restructureCastAndValidationErrorsFromMongoose } = require('../error/exceptions')
const ObjectID = require('mongodb').ObjectID

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

    res.status(STATUS_CODES.OK).json(aggCursor)
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    next(handledError)
  } 
})

module.exports = statisticsRouter