const router = require('express').Router()
const { restructureCastAndValidationErrorsFromMongoose, ResourceNotFoundException, InvalidParameterException } = require('../error/exceptions')
const Product = require('../models/product')
const ProductUserCounter = require('../models/productUserCounter')
const authUtils = require('../utils/auth')
const STATUS_CODES = require('http-status')

const { PRODUCT_USER_COUNT_REQUEST_TYPE } = require('../enum/productUserCount')
const { tryCastToInteger } = require('../utils/validation')
const ObjectID = require('mongodb').ObjectID
const { isValid, fromUnixTime, addDays, subDays, differenceInCalendarDays, endOfDay, startOfDay } = require('date-fns')

const URLS = {
  BASE_URL: '/statistics',
  UPDATE_PRODUCT_USER_COUNT: '/user/product',
  GET_PRODUCT_USER_COUNT: '/user/product',
  GET_USER_RECYCLINGRATES_PER_PRODUCT: '/user/recyclingratesperproduct',
  GET_USER_RECYCLINGRATES_PER_DAY: '/user/recyclingratesperday',
}

// Yksittäisen tuotteen kirrätys- tai ostotapahtumien päivitys
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

// Yksittäisen tuotteen kierrätystilastojen haku
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

// Palauttaa käyttäjän osto ja kierrätystapahtumat tuotteittain listattuna
router.get(URLS.GET_USER_RECYCLINGRATES_PER_PRODUCT, async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)
    let today = new Date()
    const eventsPerProduct = await getRecyclingRatesPerProductUpToDate(user, endOfDay(today))

    res.status(STATUS_CODES.OK).json(eventsPerProduct)
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    next(handledError)
  }
})

// Palauttaa taulukon käyttäjän päivittäisistä kokonaiskierrätysasteista, kyselyn osoiterivillä annettujen päivien väliltä
router.get(URLS.GET_USER_RECYCLINGRATES_PER_DAY, async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)

    let startDate = fromUnixTime(req.query.start / 1000)
    let endDate = fromUnixTime(req.query.end / 1000)

    if (!isValid(startDate) || !isValid(endDate)) {
      throw new InvalidParameterException(
        'Kyselyn parametrit on ilmoitettava unix-aikaleimoina. Annettiin \'' + req.query.start + '\' ja \'' + req.query.end + '\'')
    }

    if (startDate > endDate) {
      throw new InvalidParameterException(
        'Kyselyn alkupäivämäärän on oltava pienempi kun loppupäivämäärän. Annettiin \'' + startDate + '\' ja \'' + endDate + '\'')
    }

    const period = differenceInCalendarDays(endDate, startDate) + 1 // yksi päivä lisää, jotta saadaan kaikkien päivien määrä
    let dailyRecyclingrateTable = new Array
    let requestedDay = subDays(endDate, period)

    for (let i = 0; i <= period; i++) {
      let dailyValuesPerProduct = await getRecyclingRatesPerProductUpToDate(user, endOfDay(requestedDay))

      let totalPurchases = 0
      let totalRecycles = 0
      for (let i = 0; i < dailyValuesPerProduct.length; i++) {
        totalPurchases += dailyValuesPerProduct[i].purchaseCount
        totalRecycles += dailyValuesPerProduct[i].recycleCount
      }

      let totalRecyclingRate = (totalRecycles === 0) ? 0 : totalRecycles / totalPurchases * 100
      dailyRecyclingrateTable.push(totalRecyclingRate)
      requestedDay = addDays(requestedDay, 1)
    }

    res.status(STATUS_CODES.OK).json(dailyRecyclingrateTable)
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    next(handledError)
  }
})

// Hakee annetun käyttäjän viimeisimmät kierrätystilastot tuotteittain annetulta päivältä
async function getRecyclingRatesPerProductUpToDate(user, beforeDate) {
  let today = new Date()
  let afterDate = subDays(today, 365) // kuinka kaukaa tietoja haetaan
  const eventsPerProduct = await ProductUserCounter.collection.aggregate([
    {
      // Rajataan haku kirjautuneen käyttäjän tietoihin
      $match: {
        'userID': new ObjectID(user.id),
        // Rajataan viimeisimpiin tapahtumiin, tai niihin joista aikaleima puuttuu
        $or: [
          { 'createdAt': { $gte: afterDate, $lte: beforeDate } },
          { 'createdAt': { $exists: false } }
        ]
      }
    },
    {
      // Ryhmitellään tuotteittain ja haetaan viimeisimmät tiedot hankinnoille ja kierrätyksille
      $group: {
        _id: '$productID',
        'purchaseCount': { $last: '$purchaseCount' },
        'recycleCount': { $last: '$recycleCount' },
      }
    },
    {
      $sort: {
        'createdAt': -1
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
      // Karsitaan turhat tiedot pois
      $project: {
        purchaseCount: '$purchaseCount',
        recycleCount: '$recycleCount',
        productID: {
          id: '$_id',
          name: '$productID.name'
        }
      }
    },
  ]).toArray()
  return eventsPerProduct
}

module.exports = { router, URLS }