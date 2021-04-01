const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

const Product = require('../models/product')
const User = require('../models/user')

const productsData = [
  { name: 'Mustamakkarakastike pullo' },
  {
    name: 'Sanomalehti',
  },
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

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

const getToken = async (props) => {
  const login = await api
    .post('/api/login')
    .send(props)
  
  return login.body.token
}

test('products are returned as json', async () => {
  await api
    .get('/api/products')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all products are returned', async () => {
  const response = await api.get('/api/products')

  expect(response.body).toHaveLength(productsData.length)
})

test('known existing product is in all products', async () => {
  const response = await api.get('/api/products')
  const contents = response.body.map((r) => r.name)

  expect(contents).toContain('Mustamakkarakastike pullo')
})

test('Product cannot be added if not logged in', async () => {
  const newProduct = {
    name: 'maito',
  }
  await api
    .post('/api/products')
    .send(newProduct)
    .expect(401)
    .expect('Content-Type', /application\/json/)
})

describe('One account already in database', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('salasana', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })
  test('account can be made with new username', async () => {
    const usersAtStart = await usersInDb()
    const newUser = {
      username: 'admin',
      password: 'adminn',
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  })

  test('user can login', async () => {
    const user = {
      username: 'root',
      password: 'salasana',
    }

    const token = await getToken(user)
    //console.log(token)
    expect(token).not.toBe(undefined)
    

  })

  test('user can add products to favourites', async () => {
    const user = {
      username: 'root',
      password: 'salasana',
    }

    const token = await getToken(user)

    const allProducts = await api.get('/api/products')
    const product = allProducts.body[0]

    const result = await api
      .post('/api/users/products/' + product.id)
      .set('Authorization', 'bearer ' + token)
      .set('Content-Type',  'application/json')
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const decodedToken = jwt.verify(token, config.SECRET)
    expect(result.body.users[0]).toBe(decodedToken.id)
  })

  test('user can remove products from favourites', async () => {
    const user = {
      username: 'root',
      password: 'salasana',
    }

    const token = await getToken(user)
    //console.log(token)

    const allProducts = await api.get('/api/products')
    const product = allProducts.body[0]

    // Lisätään
    
    const result = await api
      .post('/api/users/products/' + product.id)
      .set('Authorization', 'bearer ' + token)
      .set('Content-Type',  'application/json')
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const decodedToken = jwt.verify(token, config.SECRET)
    expect(result.body.users[0]).toBe(decodedToken.id)

    // Lisätään poistetaan

    const resultB = await api
      .post('/api/users/products/remove/' + product.id)
      .set('Authorization', 'bearer ' + token)
      .set('Content-Type',  'application/json')
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(resultB.body.users[0]).not.toBe(decodedToken.id)
  })



})

afterAll(() => {
  mongoose.connection.close()
})
