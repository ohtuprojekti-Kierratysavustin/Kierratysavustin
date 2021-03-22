const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")

const api = supertest(app)


const Product = require('../models/product')
const productA = {
  name: 'Mustamakkarakastike pullo',
}

const productB = {
  name: 'Sanomalehti',
}

const productsData = [
  productA,
  productB
]
beforeEach(async () => {
  await Product.deleteMany({})
  let productObject = new Product(productsData[0])
  await productObject.save()
  productObject = new Product(productsData[1])
  await productObject.save()
})

/* const productsInDb = async () => {
  const products = await Product.find({})
  return products.map(p => p.toJSON())
} */

test("products are returned as json", async () => {
  await api
    .get("/api/products")
    .expect(200)
    .expect("Content-Type", /application\/json/)
})

test('all products are returned', async () => {
  const response = await api.get('/api/products')

  expect(response.body).toHaveLength(productsData.length)
})

test('known existing product is in all products', async () => {
  const response = await api.get('/api/products')
  const contents = response.body.map(r => r.name)

  expect(contents).toContain(
    'Mustamakkarakastike pullo'
  )
})

afterAll(() => {
  mongoose.connection.close()
})
