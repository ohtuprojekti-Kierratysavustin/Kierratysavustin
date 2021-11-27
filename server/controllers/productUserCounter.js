const router = require('express').Router()
const { restructureCastAndValidationErrorsFromMongoose, ResourceNotFoundException, InvalidParameterException } = require('../error/exceptions')
const Product = require('../models/product')
const ProductUserCounter = require('../models/productUserCounter')
const authUtils = require('../utils/auth')
const STATUS_CODES = require('http-status')

const { PRODUCT_USER_COUNT_REQUEST_TYPE } = require('../enum/productUserCount')
const { tryCastToInteger } = require('../utils/validation')
const ObjectID = require('mongodb').ObjectID
const { isValid, fromUnixTime, addDays, subDays, endOfDay, startOfDay } = require('date-fns')

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
    let user = await authUtils.authenticateRequestReturnUser(req).catch((error) => { throw error })

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

// Palauttaa taulukon käyttäjän päivittäisistä kokonaiskierrätysasteista.
// Kyselyn parametreina annetaan mihin päivään asti tietoja haetaan, kuinka pitkältä ajanjaksolta tätä päivää ennen
// ja mahdollisesti mihin tuotteeseen kysely kohdistetaan. Jos tuotetta ei ole määritetty, palautetaan
// kaikkien tuotteitten kokonaiskierrätysasteet.
router.get(URLS.GET_USER_RECYCLINGRATES_PER_DAY, async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)
    const endDate = fromUnixTime(req.query.end / 1000)
    const numDays = tryCastToInteger(req.query.days)
    const productID = req.query.product

    if (numDays <= 0) {
      throw new InvalidParameterException(
        'Kyselyn päivien lukumäärän on oltava positiivinen kokonaisluku. Annettiin \'' + req.query.days + '\'')
    }

    if (!isValid(endDate)) {
      throw new InvalidParameterException(
        'Kyselyn päivämäärä on ilmoitettava unix-aikaleimana. Annettiin \'' + req.query.end + '\'')
    }

    let stats
    if (productID) {
      stats = await getRecyclingrateStatsForSingleProduct(user, endDate, numDays, productID)
    } else {
      stats = await getRecyclingrateStatsForAllProducts(user, endDate, numDays)
    }

    res.status(STATUS_CODES.OK).json(stats)
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    next(handledError)
  }
})

// Palauttaa taulukon kokonaiskierrätysasteista
async function getRecyclingrateStatsForAllProducts(user, endDate, numDays) {
  let dailyRecyclingrateTable = new Array
  let requestedDay = subDays(endOfDay(endDate), numDays-1)

  for (let i = 0; i < numDays; i++) {
    let totalPurchases = 0
    let totalRecycles = 0
    
    let dailyValuesPerProduct = await getRecyclingRatesPerProductUpToDate(user, requestedDay)
    for (let i = 0; i < dailyValuesPerProduct.length; i++) {
      totalPurchases += dailyValuesPerProduct[i].purchaseCount
      totalRecycles += dailyValuesPerProduct[i].recycleCount
    }

    let totalRecyclingRate = (totalRecycles === 0) ? 0 : totalRecycles / totalPurchases * 100
    dailyRecyclingrateTable.push(totalRecyclingRate)
    requestedDay = addDays(requestedDay, 1)
  }
  return dailyRecyclingrateTable
}

// Palauttaa taulukon yksittäisen tuotteen kierrätysasteista
async function getRecyclingrateStatsForSingleProduct(user, endDate, numDays, productID) {
  let dailyRecyclingrateTable = new Array
  let requestedDay = subDays(endOfDay(endDate), numDays-1)

  for (let i = 0; i < numDays; i++) {     
    let dailyValuesPerProduct = await getRecyclingRatesPerProductUpToDate(user, requestedDay, productID)
    if (dailyValuesPerProduct.length > 0) {
      let recyclingRate = (dailyValuesPerProduct[0].recycleCount === 0)
        ? 0 
        : dailyValuesPerProduct[0].recycleCount / dailyValuesPerProduct[0].purchaseCount * 100
      dailyRecyclingrateTable.push(recyclingRate)
    } else {
      dailyRecyclingrateTable.push(0)
    }
    requestedDay = addDays(requestedDay, 1)
  }
  return dailyRecyclingrateTable
}

// Hakee käyttäjän viimeisimmät kierrätystilastot annetulta päivältä.
async function getRecyclingRatesPerProductUpToDate(user, beforeDate, productID) {
  let today = new Date()
  let afterDate = subDays(today, 365) // kuinka kaukaa tietoja haetaan

  let filter = {
    // Rajataan haku kirjautuneen käyttäjän tietoihin.
    'userID': new ObjectID(user.id),
    // Rajataan viimeisimpiin tapahtumiin, tai niihin joista aikaleima puuttuu.
    $or: [
      { 'createdAt': { $gte: afterDate, $lte: endOfDay(beforeDate) } },
      { 'createdAt': { $exists: false } }
    ],
  }
  
  // Jos funktille on annettu tuotteen ID, lisätään se rajausehtoihin.
  if (productID) {
    filter = { 'productID': new ObjectID(productID), ...filter }
  }

  const eventsPerProduct = await ProductUserCounter.collection.aggregate([
    {
      $match: filter
    },
    {
      // Ryhmitellään tuotteittain ja haetaan viimeisimmät tiedot hankinnoille ja kierrätyksille.
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
      // Haetaan tuotteen tiedot taulusta products.
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