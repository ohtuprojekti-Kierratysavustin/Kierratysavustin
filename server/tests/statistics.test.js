const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Product = require('../models/product')
const User = require('../models/user')
const helper = require('./test_helper')
const STATUS_CODES = require('http-status')

let loginData = undefined
const numberOfDays = 15
let today = new Date()
let previousDay = new Date()
previousDay.setDate(today.getDate() - (numberOfDays - 2))
today = today.getTime()
previousDay = previousDay.getTime()

beforeEach(async () => {
  //console.log('Starting to initialize test in product user counters!')
  await helper.clearDatabase()

  await helper.addNewUser({ username: 'root', password: 'salasana' })
  loginData = await helper.login({ username: 'root', password: 'salasana' })

  await helper.addNewProduct({ name: helper.productsData[0].name }, loginData.token)
  await helper.addNewProduct({ name: helper.productsData[1].name }, loginData.token)
  //console.log('Product 1 initialized for test', productObject) 
})

// Product Recycle stats
///////////////////////////////////////////////////////////////////////////////////////////////////
describe('Product Recycling Statistics', () => {

  describe('User Recycling rates Per Product', () => {

    test('Empty by default', async () => {
      const response = await helper.getUserCumulativeRecyclingRatesPerProduct(loginData.token)

      expect(response.body[0]).toBe(undefined)
    })

    test('Purchase stats grows after purchasing ', async () => {
      const allProducts = await helper.getProducts()
      const product = allProducts.body[0]

      await helper.purchaseProductFreeAmount(product.id, 4, loginData.token)
      await helper.purchaseProductOnce(product.id, loginData.token)
      await helper.purchaseProductOnce(product.id, loginData.token)
      await helper.purchaseProductOnce(product.id, loginData.token)
      const response = await helper.getUserCumulativeRecyclingRatesPerProduct(loginData.token)

      expect(response.body[0].purchaseCount).toBe(7)
    })

    test('Recycle stats grows after recycling ', async () => {
      const allProducts = await helper.getProducts()
      const product = allProducts.body[0]

      await helper.purchaseProductOnce(product.id, loginData.token)
      await helper.recycleProductOnce(product.id, loginData.token)
      const response = await helper.getUserCumulativeRecyclingRatesPerProduct(loginData.token)

      expect(response.body[0].recycleCount).toBe(1)
    })

    test('Purchase stats update after unpurchasing', async () => {
      const allProducts = await helper.getProducts()
      const product = allProducts.body[0]

      await helper.purchaseProductFreeAmount(product.id, 2, loginData.token)
      await helper.recycleProductOnce(product.id, loginData.token)
      await helper.unPurchaseProductOnce(product.id, loginData.token)
      const response = await helper.getUserCumulativeRecyclingRatesPerProduct(loginData.token)

      expect(response.body[0].purchaseCount).toBe(1)
    })

    test('Recycle stats update after unrecycling', async () => {
      const allProducts = await helper.getProducts()
      const product = allProducts.body[0]

      await helper.purchaseProductFreeAmount(product.id, 2, loginData.token)
      await helper.recycleProductOnce(product.id, loginData.token)
      await helper.unrecycleProductOnce(product.id, loginData.token)
      const response = await helper.getUserCumulativeRecyclingRatesPerProduct(loginData.token)

      expect(response.body[0].recycleCount).toBe(0)
    })

    test('Returns product name', async () => {
      const allProducts = await helper.getProducts()
      const product = allProducts.body[0]

      await helper.purchaseProductOnce(product.id, loginData.token)
      await helper.recycleProductOnce(product.id, loginData.token)
      const response = await helper.getUserCumulativeRecyclingRatesPerProduct(loginData.token)
      expect(response.body[0].productID.name).toBe('Mustamakkarakastike pullo')
    })

    test('Cannot be accessed without login', async () => {
      const response = await helper.getUserCumulativeRecyclingRatesPerProduct('INVALID_TOKEN')
      expect(response.status).toBe(STATUS_CODES.UNAUTHORIZED)
    })
  })

  describe('User Recycling rates Per Day', () => {

    describe('All products (product=null)', () => {

      test('Returns correct number of results', async () => {
        const response = await helper.getUserRecyclingratesPerDay(today, numberOfDays, null, loginData.token)
        expect(response.status).toBe(STATUS_CODES.OK)
        expect(response.body).toHaveLength(numberOfDays)
      })

      test('Cannot be accessed without login', async () => {
        const numberOfDays = 15
        const today = new Date()
        const previousDay = new Date()
        previousDay.setDate(today.getDate - numberOfDays)
        const response = await helper.getUserRecyclingratesPerDay(today, numberOfDays, null, 'invalidToken')
        expect(response.status).toBe(STATUS_CODES.UNAUTHORIZED)
      })

      test('Error with invalid end-param', async () => {
        const text = 'iddqd'
        const response = await helper.getUserRecyclingratesPerDay(text, numberOfDays, null, loginData.token)
        expect(response.status).toBe(STATUS_CODES.BAD_REQUEST)
      })

      test('Error with not integer days-param', async () => {
        let end = 'iddqd'
        const today = new Date()

        let response = await helper.getUserRecyclingratesPerDay(today, end, null, loginData.token)
        expect(response.status).toBe(STATUS_CODES.BAD_REQUEST)
        end = 1.48

        response = await helper.getUserRecyclingratesPerDay(today, end, null, loginData.token)
        expect(response.status).toBe(STATUS_CODES.BAD_REQUEST)
      })

      test('Returns correct results', async () => {
        const allProducts = await helper.getProducts()
        const product = allProducts.body[0]

        const purchased = 53
        const recycled = 22

        await helper.purchaseProductFreeAmount(product.id, purchased, loginData.token)
        await helper.recycleProductFreeAmount(product.id, recycled, loginData.token)

        const response = await helper.getUserRecyclingratesPerDay(today, numberOfDays, null, loginData.token)
        expect(response.body[numberOfDays - 1]).toBeCloseTo(recycled / purchased * 100)
      })
    })

  })
})

afterAll(async () => {
  await helper.clearDatabase()
  await helper.addNewUser({
    username: 'test',
    password: 'testtest',
  })
  mongoose.connection.close()
})
