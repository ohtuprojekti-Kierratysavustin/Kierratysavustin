const mongoose = require('mongoose')
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
describe('Product Recycling Counters', () => {

  test('user can recycle an existing product', async () => {
    const allProducts = await helper.getProducts()
    const product = allProducts.body[0]

    await helper.purchaseProductOnce(product.id, loginData.token)
    await helper.recycleProductOnce(product.id, loginData.token)

    const response = await helper.getProductUserCounts(product.id, loginData.token)
    expect(response.body.recycleCount).toBe(1)

  })

  test('user can recycle an existing product multiple times', async () => {
    const allProducts = await helper.getProducts()
    const product = allProducts.body[0]

    await helper.purchaseProductFreeAmount(product.id, 4, loginData.token)

    await helper.recycleProductOnce(product.id, loginData.token)
    await helper.recycleProductOnce(product.id, loginData.token)
    await helper.recycleProductOnce(product.id, loginData.token)
    await helper.recycleProductOnce(product.id, loginData.token)

    const response = await helper.getProductUserCounts(product.id, loginData.token)
    expect(response.body.recycleCount).toBe(4)
  })

  test('user can unrecycle an existing product that has been recycled', async () => {
    const allProducts = await helper.getProducts()
    const product = allProducts.body[0]

    await helper.purchaseProductFreeAmount(product.id, 3, loginData.token)

    await helper.recycleProductOnce(product.id, loginData.token)
    await helper.recycleProductOnce(product.id, loginData.token)
    await helper.recycleProductOnce(product.id, loginData.token)
    await helper.unrecycleProductOnce(product.id, loginData.token)
    await helper.unrecycleProductOnce(product.id, loginData.token)

    const response = await helper.getProductUserCounts(product.id, loginData.token)
    expect(response.body.recycleCount).toBe(1)
  })

  test('user can not set product recycle stat to negative', async () => {
    const allProducts = await helper.getProducts()
    const product = allProducts.body[0]

    await helper.purchaseProductFreeAmount(product.id, 3, loginData.token)

    await helper.recycleProductOnce(product.id, loginData.token)
    await helper.unrecycleProductOnce(product.id, loginData.token)
    await helper.unrecycleProductOnce(product.id, loginData.token)
    await helper.unrecycleProductOnce(product.id, loginData.token)

    const response = await helper.getProductUserCounts(product.id, loginData.token)
    expect(response.body.recycleCount).toBe(0)
  })

  test('unrecycling to smaller than 0, leaves unrecycling stat untouched', async () => {
    const allProducts = await helper.getProducts()
    const product = allProducts.body[0]

    await helper.purchaseProductFreeAmount(product.id, 3, loginData.token)

    await helper.recycleProductOnce(product.id, loginData.token)
    await helper.recycleProductOnce(product.id, loginData.token)
    await helper.purchaseProductFreeAmount(product.id, -5, loginData.token)

    const response = await helper.getProductUserCounts(product.id, loginData.token)
    expect(response.body.recycleCount).toBe(2)
  })

  test('user can not recycle more than purchased', async () => {
    const allProducts = await helper.getProducts()
    const product = allProducts.body[0]

    await helper.purchaseProductOnce(product.id, loginData.token)
    await helper.purchaseProductOnce(product.id, loginData.token)
    await helper.purchaseProductOnce(product.id, loginData.token)
    await helper.recycleProductOnce(product.id, loginData.token)
    await helper.recycleProductOnce(product.id, loginData.token)

    let response = await helper.getProductUserCounts(product.id, loginData.token)
    expect(response.body.recycleCount).toBe(2)
    expect(response.body.purchaseCount).toBe(3)

    await helper.recycleProductOnce(product.id, loginData.token)
    await helper.recycleProductOnce(product.id, loginData.token)

    response = await helper.getProductUserCounts(product.id, loginData.token)
    expect(response.body.recycleCount).toBe(3)
    expect(response.body.purchaseCount).toBe(3)

  })
  test('adding count returns error on not integer amount', async () => {
    const allProducts = await helper.getProducts()
    const product = allProducts.body[0]

    let response = await helper.purchaseProductFreeAmount(product.id, 'sff24', loginData.token)
    expect(response.status).toBeGreaterThanOrEqual(400)
    response = await helper.purchaseProductFreeAmount(product.id, 1.57, loginData.token)
    expect(response.status).toBeGreaterThanOrEqual(400)

  })

  test('recycling nonexistent product responds with product not found', async () => {

    const response = await helper.recycleProductOnce('111111111111111111111111', loginData.token)
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND)
  })

  test('recycling without authorization not possible', async () => {
    const allProducts = await helper.getProducts()
    const product = allProducts.body[0]

    const response = await helper.getProductUserCounts(product.id, 'INVALID_TOKEN')
    expect(response.status).toBe(STATUS_CODES.UNAUTHORIZED)

  })

  test('count stats of nonexistent product responds with product not found', async () => {

    const response = await helper.getProductUserCounts('111111111111111111111111', loginData.token)
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND)

  })

  // Purchase product
  ////////////////////////////////////////////////////////////////////////////////////////////////
  test('user can purchase an existing product', async () => {
    const allProducts = await helper.getProducts()
    const product = allProducts.body[0]
    await helper.purchaseProductOnce(product.id, loginData.token)
    const response = await helper.getProductUserCounts(product.id, loginData.token)
    expect(response.body.purchaseCount).toBe(1)

  })

  test('user can purchase an existing product multiple times', async () => {
    const allProducts = await helper.getProducts()
    const product = allProducts.body[0]

    await helper.purchaseProductFreeAmount(product.id, 4, loginData.token)
    await helper.purchaseProductOnce(product.id, loginData.token)
    await helper.purchaseProductOnce(product.id, loginData.token)
    await helper.purchaseProductOnce(product.id, loginData.token)


    const response = await helper.getProductUserCounts(product.id, loginData.token)
    expect(response.body.purchaseCount).toBe(7)
  })

  test('user can unpurchase an existing product that has been purchased', async () => {
    const allProducts = await helper.getProducts()
    const product = allProducts.body[0]

    await helper.purchaseProductFreeAmount(product.id, 3, loginData.token)
    await helper.unPurchaseProductOnce(product.id, loginData.token)
    await helper.unPurchaseProductOnce(product.id, loginData.token)

    const response = await helper.getProductUserCounts(product.id, loginData.token)
    console.log(response)
    expect(response.body.purchaseCount).toBe(1)
  })

  test('user can not set product purchase stat to negative', async () => {
    const allProducts = await helper.getProducts()
    const product = allProducts.body[0]

    await helper.unPurchaseProductOnce(product.id, loginData.token)
    let response = await helper.getProductUserCounts(product.id, loginData.token)
    expect(response.body.purchaseCount).toBe(0)
  })

  test('unpurchasing to smaller than 0, leaves purchase stat untouched', async () => {
    const allProducts = await helper.getProducts()
    const product = allProducts.body[0]

    await helper.purchaseProductFreeAmount(product.id, 3, loginData.token)

    await helper.purchaseProductFreeAmount(product.id, -53, loginData.token)

    const response = await helper.getProductUserCounts(product.id, loginData.token)
    expect(response.body.purchaseCount).toBe(3)
  })

  test('user can not unpurchase product to have less purchases than recycles', async () => {
    const allProducts = await helper.getProducts()
    const product = allProducts.body[0]

    await helper.purchaseProductOnce(product.id, loginData.token)
    await helper.purchaseProductOnce(product.id, loginData.token)
    await helper.purchaseProductOnce(product.id, loginData.token)
    await helper.recycleProductOnce(product.id, loginData.token)
    await helper.recycleProductOnce(product.id, loginData.token)
    await helper.recycleProductOnce(product.id, loginData.token)

    let response = await helper.getProductUserCounts(product.id, loginData.token)
    expect(response.body.recycleCount).toBe(3)
    expect(response.body.purchaseCount).toBe(3)

    await helper.unPurchaseProductOnce(product.id, loginData.token)

    response = await helper.getProductUserCounts(product.id, loginData.token)
    expect(response.body.recycleCount).toBe(3)
    expect(response.body.purchaseCount).toBe(3)

  })

  test('purchasing nonexistent product responds with product not found', async () => {

    const response = await helper.purchaseProductOnce('111111111111111111111111', loginData.token)
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND)
  })

  // User recycling counter updating
  //////////////////////////////////////////////////////////////////////////////////////

  test('recycling without authorization not possible', async () => {
    const allProducts = await helper.getProducts()
    const product = allProducts.body[0]

    const response = await helper.getProductUserCounts(product.id, 'INVALID_TOKEN')
    expect(response.status).toBe(STATUS_CODES.UNAUTHORIZED)

  })

  test('count stats of nonexistent product responds with product not found', async () => {
    const response = await helper.getProductUserCounts('111111111111111111111111', loginData.token)
    expect(response.status).toBe(STATUS_CODES.NOT_FOUND)
  })

  test('count stats not given without authorization', async () => {
    const allProducts = await helper.getProducts()
    const product = allProducts.body[0]

    const response = await helper.getProductUserCounts(product.id, 'INVALID_TOKEN')
    expect(response.status).toBe(STATUS_CODES.UNAUTHORIZED)
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
