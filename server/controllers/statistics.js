const router = require('express').Router()
const { restructureCastAndValidationErrorsFromMongoose, InvalidParameterException } = require('../error/exceptions')
const ProductUserCounter = require('../models/productUserCounter')
const authUtils = require('../utils/auth')
const STATUS_CODES = require('http-status')

const { tryCastToInteger } = require('../utils/validation')
const ObjectID = require('mongodb').ObjectID
const { isValid, fromUnixTime, addDays, subDays, endOfDay } = require('date-fns')

const URLS = {
  BASE_URL: '/statistics',
  GET_USER_CUMULATIVE_RECYCLINGRATES_PER_PRODUCT: '/user/recyclingratesperproduct',
  GET_USER_CUMULATIVE_RECYCLINGRATES_PER_DAY: '/user/recyclingratesperday',
}

// Palauttaa käyttäjän osto ja kierrätystapahtumat tuotteittain listattuna
router.get(URLS.GET_USER_CUMULATIVE_RECYCLINGRATES_PER_PRODUCT, async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)
    let today = new Date()
    const eventsPerProduct = await getUserRecyclingRatesPerProductUpToDate(user, endOfDay(today))

    res.status(STATUS_CODES.OK).json(eventsPerProduct)
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    next(handledError)
  }
})

// Palauttaa kumulatiivisen taulukon käyttäjän päivittäisistä kokonaiskierrätysasteista.
// Kyselyn parametreina annetaan mihin päivään asti tietoja haetaan, kuinka pitkältä ajanjaksolta tätä päivää ennen
// ja mahdollisesti mihin tuotteeseen kysely kohdistetaan. Jos tuotetta ei ole määritetty, palautetaan
// kaikkien tuotteiden kokonaiskierrätysasteet.
router.get(URLS.GET_USER_CUMULATIVE_RECYCLINGRATES_PER_DAY, async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)
    const endDate = fromUnixTime(tryCastToInteger(req.query.end) / 1000)
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
      stats = await getCumulativeRecyclingrateForSingleProductPerDays(user, endDate, numDays, productID)
    } else {
      stats = await getCumulativeRecyclingrateForAllProductsPerDays(user, endDate, numDays)
    }

    res.status(STATUS_CODES.OK).json(stats)
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    next(handledError)
  }
})

// Palauttaa taulukon kokonaiskierrätysasteista
async function getCumulativeRecyclingrateForAllProductsPerDays(user, endDate, numDays) {
  let dailyRecyclingrateArray = new Array
  let requestedDay = subDays(endOfDay(endDate), numDays-1)

  for (let i = 0; i < numDays; i++) {
    let totalPurchases = 0
    let totalRecycles = 0
    
    let dailyValuesPerProduct = await getUserRecyclingRatesPerProductUpToDate(user, requestedDay)
    for (let i = 0; i < dailyValuesPerProduct.length; i++) {
      totalPurchases += dailyValuesPerProduct[i].purchaseCount
      totalRecycles += dailyValuesPerProduct[i].recycleCount
    }

    let totalRecyclingRate = (totalRecycles === 0) ? 0 : totalRecycles / totalPurchases * 100
    dailyRecyclingrateArray.push(totalRecyclingRate)
    requestedDay = addDays(requestedDay, 1)
  }
  return dailyRecyclingrateArray
}

// Palauttaa taulukon yksittäisen tuotteen kierrätysasteista
async function getCumulativeRecyclingrateForSingleProductPerDays(user, endDate, numDays, productID) {
  let dailyRecyclingrateArray = new Array
  let requestedDay = subDays(endOfDay(endDate), numDays-1)

  for (let i = 0; i < numDays; i++) {     
    let dailyValuesPerProduct = await getUserRecyclingRatesPerProductUpToDate(user, requestedDay, productID)
    if (dailyValuesPerProduct.length > 0) {
      let recyclingRate = (dailyValuesPerProduct[0].recycleCount === 0)
        ? 0 
        : dailyValuesPerProduct[0].recycleCount / dailyValuesPerProduct[0].purchaseCount * 100
      dailyRecyclingrateArray.push(recyclingRate)
    } else {
      dailyRecyclingrateArray.push(0)
    }
    requestedDay = addDays(requestedDay, 1)
  }
  return dailyRecyclingrateArray
}

// Hakee käyttäjän viimeisimmät kierrätystilastot annetulta päivältä.
async function getUserRecyclingRatesPerProductUpToDate(user, beforeDate, productID) {
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
      $sort: {
        'createdAt': 1
      }
    },
    {
      // Ryhmitellään tuotteittain ja haetaan viimeisimmät tiedot hankinnoille ja kierrätyksille.
      $group: {
        _id: '$productID',
        'purchaseCount': { $last: '$purchaseCount' },
        'recycleCount': { $last: '$recycleCount' }
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