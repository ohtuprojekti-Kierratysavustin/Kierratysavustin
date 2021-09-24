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

const getInstructionsOfProduct = async (product) => {
  const result = await api.get(`/api/products/${product.id}`)
  return result.body.instructions
}

const addNewProduct = async (newProduct, token) => {
  const result = await api
    .post('/api/products')
    .set('Authorization', `bearer ${token}`)
    .send(newProduct)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  return result
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


const deleteInstruction = async (product, token, instruction) => {
  const result = await api
    .put(`/api/products/${product.id}/instructions/${instruction.id}`)
    .set('Authorization', 'bearer ' + token)
    .set('Content-Type', 'application/json')
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
  usersInDb, getToken, productsData, getProducts, getInstructionsOfProduct
  , addInstruction, deleteInstruction, likeInstruction, disLikeInstruction
  , unLikeInstruction, unDisLikeInstruction, addFavourite
  , removeFavourite, addNewProduct
}