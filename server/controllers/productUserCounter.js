const router = require('express').Router()
const { restructureCastAndValidationErrorsFromMongoose, ResourceNotFoundException, InvalidParameterException } = require('../error/exceptions')
const Product = require('../models/product')
const ProductUserCounter = require('../models/productUserCounter')
const authUtils = require('../utils/auth')
const STATUS_CODES = require('http-status')

const { PRODUCT_USER_COUNT_REQUEST_TYPE } = require('../enum/productUserCount')
const { tryCastToInteger } = require('../utils/validation')
const { startOfDay, endOfDay } = require('date-fns')
const ObjectID = require('mongodb').ObjectID

const URLS = { BASE_URL: '/count',
  UPDATE_PRODUCT_USER_COUNT: '/product/user',
  GET_PRODUCT_USER_COUNT: '/product/user',
}

router.post(URLS.UPDATE_PRODUCT_USER_COUNT, async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req).catch((error) => { throw error })

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

    let productUserCounter = null
    
    // Haetaan tietokannasta tuote-käyttäjä paria joka olisi luotu tänään
    let today = new Date()
    productUserCounter = await ProductUserCounter.findOne({
      createdAt: {
        $gte: startOfDay(today),
        $lte: endOfDay(today)
      },
      userID: user.id,
      productID: product.id
    }).exec()

    if (!productUserCounter) {
      productUserCounter = new ProductUserCounter({
        userID: user.id,
        productID: product.id
      })
    }

    let amount = tryCastToInteger(body.amount, 'Lisättävän määrän on oltava kokonaisluku! Annettiin {value}', 'amount')
    let productUserCountSums = await getProductUserCountSums(user, product)
    if (!productUserCountSums) {
      productUserCountSums = new ProductUserCounter({
        purchaseCount:0, 
        recycleCount:0,
        userID: user.id,
        productID: product.id
      })
    }

    let successMessage = 'Tuotteen \'{nimi}\' '
    if (body.type === PRODUCT_USER_COUNT_REQUEST_TYPE.RECYCLE) {
      if ((productUserCountSums.recycleCount + amount) < 0) {
        throw new InvalidParameterException('Tuotteen kierrätystilasto ei voi olla pienempi kuin 0!')
      } else if((productUserCountSums.recycleCount + amount) > productUserCountSums.purchaseCount) {
        throw new InvalidParameterException('Kierrätettyjen tuotteiden lukumäärä ei voi olla suurempi kuin hankittujen tuotteiden lukumäärä')
      } else {
        productUserCounter.recycleCount += amount
        successMessage += 'Kierrätystilasto päivitetty'
      }
    } else if (body.type === PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE) {
      if (productUserCountSums && (productUserCountSums.purchaseCount + amount) < 0) {
        throw new InvalidParameterException('Hankintatilasto ei voi olla pienempi kuin 0!')
      } else if(productUserCountSums.recycleCount > (productUserCountSums.purchaseCount + amount)) {
        throw new InvalidParameterException('Kierrätettyjen tuotteiden lukumäärä ei voi olla suurempi kuin hankittujen tuotteiden lukumäärä')
      } else {
        productUserCounter.purchaseCount += amount
        successMessage += 'Hankintatilasto päivitetty'
      }
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

    const productUserCounter = await getProductUserCountSums(user, product)

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

async function getProductUserCountSums(user, product) {
  const aggCursor = await ProductUserCounter.collection.aggregate([
    {
      $match: {
        userID: new ObjectID(user.id),
        productID: new ObjectID(product.id)
      }
    },
    {
      $group: {
        _id: '$productID',
        userID : { $first: '$userID' },
        purchaseCount:  { $sum: '$purchaseCount' },
        recycleCount:  { $sum: '$recycleCount' },
      }
    },
    {
      $project: {
        productID: '$_id',
        userID: '$userID',
        purchaseCount: '$purchaseCount',
        recycleCount: '$recycleCount'
      }
    }
  ]).toArray()
  return aggCursor[0]
}

module.exports = { router, URLS }