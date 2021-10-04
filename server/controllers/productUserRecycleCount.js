const productUserRecycleCountRouter = require('express').Router()
const Product = require('../models/product')
const ProductUserRecycleCount = require('../models/productUserRecycleCount')
const authUtils = require('../utils/auth')
const STATUS_CODES = require('http-status')
const { ResourceNotFoundException, restructureCastAndValidationErrorsFromMongoose } = require('../error/exceptions')

productUserRecycleCountRouter.post('/', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req).catch((error) => { throw error })

    const body = req.body

    const product = await Product.findById(body.productID).exec()
    if (!product) {
      throw new ResourceNotFoundException('Tuotetta ID:llä: ' + body.productID + ' ei löytynyt!')
    }

    let productUserRecycleCount = await ProductUserRecycleCount.findOne({ userID: user.id, productID: product.id }).exec()
    if (!productUserRecycleCount) {
      productUserRecycleCount = new ProductUserRecycleCount({
        userID: user.id,
        productID: product.id
      })
    }

    productUserRecycleCount.count += body.amount

    await productUserRecycleCount.save()
      .then(() => {
        return res.status(STATUS_CODES.OK).json({ message: 'Tuotteen: "' + product.name + '" kierrätystilasto päivitetty!', resource: productUserRecycleCount })
      })
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    // To the errorhandler in app.js
    next(handledError)
  }
})

productUserRecycleCountRouter.get('/', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)

    const product = await Product.findById(req.query.productID)
    if (!product) {
      throw new ResourceNotFoundException('Tuotetta ID:llä: ' + req.query.productID + ' ei löytynyt!')
    }

    const productUserRecycleCount = await ProductUserRecycleCount.findOne({ userID: user.id, productID: product.id })
    if (!productUserRecycleCount) {
      return res.status(STATUS_CODES.OK).json({
        userID: user.id,
        productID: product.id,
        count: 0
      })
    }

    return res.status(STATUS_CODES.OK).json(productUserRecycleCount)
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    // To the errorhandler in app.js
    next(handledError)
  }
})


module.exports = productUserRecycleCountRouter
