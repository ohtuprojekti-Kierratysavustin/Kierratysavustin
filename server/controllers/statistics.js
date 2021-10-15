const statisticsRouter = require('express').Router()
const ProductUserCounter = require('../models/productUserCounter')
//const Product = require('../models/product')
const authUtils = require('../utils/auth')
const STATUS_CODES = require('http-status')
const { restructureCastAndValidationErrorsFromMongoose } = require('../error/exceptions')
const ObjectID = require('mongodb').ObjectID

statisticsRouter.get('/', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)
    //const productStats = await ProductUserCounter.find({userID: user.id}).populate('productID')

    // Tietokantakysely
    var user_id = new ObjectID(user.id)
    const pipeline = [
      {
        '$match': { 'userID': user_id }
      },
      {
        '$group': {
          '_id': '$productID',
          'purchased':  { '$sum': '$purchaseCount' },
          'recycled':  { '$sum': '$recycleCount' },
        }
      }
    ]

    // const findProd = async (id) => {
    //   var prod_id = new ObjectID(id)
    //   let product = await Product.findById(prod_id)
    //   console.log(product)
    //   return product
    // }

    let stats = []
    const aggCursor = ProductUserCounter.collection.aggregate(pipeline)
    await aggCursor.forEach(item => { 
      stats.push(
        {
          productID: item._id,
          purchaseCount: item.purchased,
          recycleCount: item.recycled
        }
      )  
    })

    res.status(STATUS_CODES.OK).json(stats)
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    next(handledError)
  } 
})

module.exports = statisticsRouter