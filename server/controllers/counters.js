const router = require('express').Router()
const { restructureCastAndValidationErrorsFromMongoose, ResourceNotFoundException, InvalidParameterException } = require('../error/exceptions')
const Product = require('../models/product')
const ProductUserCounter = require('../models/productUserCounter')
const authUtils = require('../utils/auth')
const STATUS_CODES = require('http-status')

const { PRODUCT_USER_COUNT_REQUEST_TYPE } = require('../enum/productUserCount')
const { tryCastToInteger } = require('../utils/validation')
const { startOfDay } = require('date-fns')

const URLS = {
  BASE_URL: '/counters',
  UPDATE_PRODUCT_USER_COUNT: '/user/product',
  GET_PRODUCT_USER_COUNT: '/user/product'
}

/*
* Yksittäisen tuotteen kierrätys, tai ostotilaston päivitys.
* Kumulatiivinen päivitys. Siis uudessa tapahtumassa on lisättynä uusi määrä vanhaan määrään.
*/
router.post(URLS.UPDATE_PRODUCT_USER_COUNT, async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)

    const body = req.body

    if (body.type !== PRODUCT_USER_COUNT_REQUEST_TYPE.RECYCLE && body.type !== PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE) {
      throw new InvalidParameterException(
        'Virheellinen kyselyn parametri \'type\'. Sallittuja: [ '
        + PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE + ', ' + PRODUCT_USER_COUNT_REQUEST_TYPE.RECYCLE + ' ] '
        + ' Annettiin \'' + body.type + '\'')
    }

    const product = await Product.findById(body.productID).exec()
    if (!product) {
      throw new ResourceNotFoundException('Tuotetta ID:llä: ' + body.productID + ' ei löytynyt!')
    }

    // Haetaan viimeisin tapahtuma
    let today = new Date()
    let productUserCounter = (await ProductUserCounter.find({ userID: user.id, productID: product.id }).sort({ createdAt: -1 }).limit(1))[0]

    if (!productUserCounter) {
      productUserCounter = new ProductUserCounter({
        userID: user.id,
        productID: product.id
      })
    }
    else if (!productUserCounter.createdAt || productUserCounter.createdAt < startOfDay(today)) {
      productUserCounter = new ProductUserCounter({
        userID: user.id,
        productID: product.id,
        purchaseCount: productUserCounter.purchaseCount,
        recycleCount: productUserCounter.recycleCount,
      })
    }

    let amount = tryCastToInteger(body.amount, 'Lisättävän määrän on oltava kokonaisluku! Annettiin {value}', 'amount')

    let successMessage = 'Tuotteen \'' + product.name + '\' '
    if (body.type === PRODUCT_USER_COUNT_REQUEST_TYPE.RECYCLE) {
      productUserCounter.recycleCount += amount
      successMessage += 'Kierrätystilasto päivitetty'
    } else if (body.type === PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE) {
      productUserCounter.purchaseCount += amount
      successMessage += 'Hankintatilasto päivitetty'
    }

    await productUserCounter.save()
      .then(() => {
        return res.status(STATUS_CODES.OK).json({ message: successMessage, resource: productUserCounter })
      })

  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    // To the errorhandler in app.js
    next(handledError)
  }
})

// Yksittäisen tuotteen hankinta/kierrätysmäärien haku
router.get(URLS.GET_PRODUCT_USER_COUNT, async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)

    const product = await Product.findById(req.query.productID).exec()
    if (!product) {
      throw new ResourceNotFoundException('Tuotetta ID:llä: ' + req.query.productID + ' ei löytynyt!')
    }

    const productUserCounter = (await ProductUserCounter.find({ userID: user.id, productID: product.id }).sort({ createdAt: -1 }).limit(1))[0]

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