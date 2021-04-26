//const Product = require('../models/product')
//const Instruction = require('../models/instruction')
const User = require('../models/user')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)

const productsData = [
  { name: 'Mustamakkarakastike pullo' },
  {
    name: 'Sanomalehti',
  },
]


const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

/* const productsInDb = async () => {
  const products = await Product.find({})
  return products.map(p => p.toJSON())
} */

const getToken = async (props) => {
  const login = await api
    .post('/api/login')
    .send(props)
    
  return login.body.token
}

const getProducts = async () => {
  const products = await api.get('/api/products')
  return products
}

const addFavourite = async (productId, token) => {
  const result = await api
    .post('/api/users/products/' + productId)
    .set('Authorization', `bearer ${token}`)
    .set('Content-Type',  'application/json')
    .expect(201)
    .expect('Content-Type', /application\/json/)
  return result
}

const removeFavourite = async (productId, token) => {
  const result = await api
    .put('/api/users/products/' + productId)
    .set('Authorization', `bearer ${token}`)
    .set('Content-Type',  'application/json')
    .expect(201)
    .expect('Content-Type', /application\/json/)
  return result
}


const addInstruction = async (product, token, instruction) => {
  const result = await api.
    post(`/api/products/${product.id}/instructions`)
    .set('Authorization', 'bearer ' + token)
    .set('Content-Type',  'application/json')
    .send(instruction)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  return result
}


const likeInstruction = async (instructionId, token) => {
  const result = await api
    .post('/api/users/likes/' + instructionId)
    .set('Authorization', `bearer ${token}`)
    .set('Content-Type',  'application/json')
    .expect(201)
    .expect('Content-Type', /application\/json/)
  return result
}

const unLikeInstruction = async (instructionId, token) => {
  const result = await api
    .put('/api/users/likes/' + instructionId)
    .set('Authorization', `bearer ${token}`)
    .set('Content-Type',  'application/json')
    .expect(201)
    .expect('Content-Type', /application\/json/)
  return result
}

const disLikeInstruction = async (instructionId, token) => {
  const result = await api
    .post('/api/users/dislikes/' + instructionId)
    .set('Authorization', `bearer ${token}`)
    .set('Content-Type',  'application/json')
    .expect(201)
    .expect('Content-Type', /application\/json/)
  return result
}

const unDisLikeInstruction = async (instructionId, token) => {
  const result = await api
    .put('/api/users/dislikes/' + instructionId)
    .set('Authorization', `bearer ${token}`)
    .set('Content-Type',  'application/json')
    .expect(201)
    .expect('Content-Type', /application\/json/)
  return result
}

module.exports = {
  usersInDb, getToken, productsData, getProducts
  , addInstruction, likeInstruction, disLikeInstruction
  , unLikeInstruction, unDisLikeInstruction, addFavourite
  , removeFavourite
}