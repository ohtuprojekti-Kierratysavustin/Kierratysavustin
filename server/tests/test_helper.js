const Product = require('../models/product')
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

const productsInDb = async () => {
  const products = await Product.find({})
  return products.map(p => p.toJSON())
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

const addInstruction = async (product, token, instruction) => {
  await api.
    post(`/api/products/${product.id}/instructions`)
    .set('Authorization', 'bearer ' + token)
    .set('Content-Type',  'application/json')
    .send(instruction)
    .expect(201)
    .expect('Content-Type', /application\/json/)
}

const likeInstruction = async (instructionId, token) => {
  await api
    .post('/api/users/likes/' + instructionId)
    .set('Authorization', `bearer ${token}`)
    .set('Content-Type',  'application/json')
    .expect(201)
    .expect('Content-Type', /application\/json/)
}

const disLikeInstruction = async (instructionId, token) => {
  await api
    .post('/api/users/dislikes/' + instructionId)
    .set('Authorization', `bearer ${token}`)
    .set('Content-Type',  'application/json')
    .expect(201)
    .expect('Content-Type', /application\/json/)
}

module.exports = {
  usersInDb, getToken, productsData, productsInDb, getProducts
  , addInstruction, likeInstruction, disLikeInstruction
}