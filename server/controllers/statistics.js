const statisticsRouter = require('express').Router()
const Product = require('../models/product')
const ProductUserCounter = require('../models/productUserCounter')
const authUtils = require('../utils/auth')
const STATUS_CODES = require('http-status')
const { restructureCastAndValidationErrorsFromMongoose } = require('../error/exceptions')

statisticsRouter.get('/', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)
    const allProducts = await Product.find({})
    const productStats = await ProductUserCounter.find({userID: user.id})
    const filteredProducts = allProducts.filter(product => productStats.some(stat =>
      product._id.toString() === stat.productID.toString()
    ))
    res.status(STATUS_CODES.OK).json(filteredProducts.map((product) => product.toJSON()))
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    next(handledError)
  } 
})

module.exports = statisticsRouter