const router = require('express').Router()
const { restructureCastAndValidationErrorsFromMongoose, ResourceNotFoundException, InvalidParameterException } = require('../error/exceptions')
const Product = require('../models/product')
const ProductUserCounter = require('../models/productUserCounter')
const authUtils = require('../utils/auth')
const STATUS_CODES = require('http-status')

const { REQUEST_TYPE } = require('../enum/productUserCount')

const URLS = { BASE_URL: '/count',
  UPDATE_PRODUCT_USER_COUNT: '/product/user',
  GET_PRODUCT_USER_COUNT: '/product/user',
}

router.post(URLS.UPDATE_PRODUCT_USER_COUNT, async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req).catch((error) => { throw error })

    const body = req.body

    if (body.type !== REQUEST_TYPE.RECYCLE && body.type !== REQUEST_TYPE.PURCHASE) {
      throw new InvalidParameterException(
        'Virheelliset kyselyn parametrit. Sallittuja: [ '
        + REQUEST_TYPE.PURCHASE + ', ' + REQUEST_TYPE.RECYCLE + ' ] '
        + ' Annettiin \'' + body.type + '\'')
    }

    const product = await Product.findById(body.productID).exec()
    if (!product) {
      throw new ResourceNotFoundException('Tuotetta ID:llä: ' + body.productID + ' ei löytynyt!')
    }

    let productUserCounter = await ProductUserCounter.findOne({ userID: user.id, productID: product.id }).exec()
    if (!productUserCounter) {
      productUserCounter = new ProductUserCounter({
        userID: user.id,
        productID: product.id
      })
    }

    let successMessage = 'Tuotteen \'{nimi}\' '
    if (body.type === REQUEST_TYPE.RECYCLE) {
      productUserCounter.recycleCount += body.amount
      successMessage += 'kierrätystilasto päivitetty'
    } else if (body.type === REQUEST_TYPE.PURCHASE) {
      productUserCounter.purchaseCount += body.amount
      successMessage += 'hankintatilasto päivitetty'
    }

    await productUserCounter.save()
      .then(() => {
        return res.status(STATUS_CODES.OK).json({ message: successMessage.replace('{nimi}', product.name), resource: productUserCounter })
      })

  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    // To the errorhandler in app.js
    next(handledError)
  }
})

router.get(URLS.GET_PRODUCT_USER_COUNT, async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req).catch((error) => { throw error })

    const product = await Product.findById(req.query.productID).exec()
    if (!product) {
      throw new ResourceNotFoundException('Tuotetta ID:llä: ' + req.query.productID + ' ei löytynyt!')
    }

    const productUserCounter = await ProductUserCounter.findOne({ userID: user.id, productID: product.id }).exec()
    if (!productUserCounter) {
      return res.status(200).json(new ProductUserCounter({
        userID: user.id,
        productID: product.id
      }))
    }

    return res.status(200).json(productUserCounter)

  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    // To the errorhandler in app.js
    next(handledError)
  }
})


module.exports = { router, URLS }