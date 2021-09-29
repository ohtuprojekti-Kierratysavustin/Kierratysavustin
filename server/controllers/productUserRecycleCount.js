const productUserRecycleCountRouter = require('express').Router()
const Product = require('../models/product')
const ProductUserRecycleCount = require('../models/productUserRecycleCount')
const authUtils = require('../utils/auth')
const STATUS_CODES = require('http-status')
const { ResourceNotFoundException, ParameterValidationException, ValidationErrorObject, buildValidationErrorObjectFromMongooseValidationError } = require('../error/exceptions')

productUserRecycleCountRouter.post('/', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req).catch((error) => { throw error })

    const body = req.body

    const product = await Product.findById(body.productID)
    if (!product) {
      throw new ResourceNotFoundException('Tuotetta ID:llä: ' + body.productID + ' ei löytynyt!')
    }

    ProductUserRecycleCount.validate
    let productUserRecycleCount = await ProductUserRecycleCount.findOne({ userID: user.id, productID: product.id })
    if (!productUserRecycleCount) {
      productUserRecycleCount = new ProductUserRecycleCount({
        userID: user.id,
        productID: product.id
      })
    }

    productUserRecycleCount.count += body.amount

    if (productUserRecycleCount.count < 0) {
      throw new ParameterValidationException(
        'Tuotteen kierrätystilasto ei voi olla pienempi kuin 0!',
        // new ValidationErrorObject(
        //   'amount',
        //   'ValidationError', 'amount should be bigger than' + (productUserRecycleCount.count - body.amount),
        //   body.amount,
        //   '> ' + (productUserRecycleCount.count - body.amount),
        //   typeof body.amount,
        //   ProductUserRecycleCount.schema.paths.count.instance
        // )
      )
    }
    productUserRecycleCount.validate

    await productUserRecycleCount.save()
      .then(() => {
        return res.status(STATUS_CODES.CREATED).json({ message: 'Tuotteen: "' + product.name + '" kierrätystilasto päivitetty!' })
      })
      .catch((error) => {
        let validationErrorObject = buildValidationErrorObjectFromMongooseValidationError(error)
        throw new ParameterValidationException('Syötteen validointi epäonnistui!', validationErrorObject)
      })
  } catch (error) {
    // To the errorhandler in app.js
    next(error)
  }
})

productUserRecycleCountRouter.get('/', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)

    const product = await Product.findById(req.query.productID)
      .catch((error) => {
        let validationErrorObject = buildValidationErrorObjectFromMongooseValidationError(error)
        throw new ParameterValidationException('Syötteen validointi epäonnistui!', validationErrorObject)
      })
    if (!product) {
      throw new ResourceNotFoundException('Tuotetta ID:llä: ' + req.query.productID + ' ei löytynyt!')
    }

    const productUserRecycleCount = await ProductUserRecycleCount.findOne({ userID: user.id, productID: product.id })
      .catch((error) => {
        let validationErrorObject = buildValidationErrorObjectFromMongooseValidationError(error)
        throw new ParameterValidationException('Syötteen validointi epäonnistui!', validationErrorObject)
      })
    if (!productUserRecycleCount) {
      return res.status(STATUS_CODES.OK).json({
        productID: product.id,
        count: 0
      })
    }

    return res.status(STATUS_CODES.OK).json({
      productID: product.id,
      count: productUserRecycleCount.count
    })
  } catch (error) {
    next(error)
  }
})


module.exports = productUserRecycleCountRouter
