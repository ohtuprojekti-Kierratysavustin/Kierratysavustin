const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const Product = require('../models/product')
const Instruction = require('../models/instruction')
const User = require('../models/user')
const STATUS_CODES = require('http-status')
const ProductUserCounter = require('../models/productUserCounter')

const { REQUEST_TYPE } = require('../enum/productUserCount')

const productUserCounterRouter = require('../controllers/productUserCounter')
const counterURLS = productUserCounterRouter.URLS

const productsData = [
  { name: 'Mustamakkarakastike pullo' },
  {
    name: 'Sanomalehti',
  }
]

const clearDatabase = async () => {
  await Product.deleteMany({})
  await Instruction.deleteMany({})
  await User.deleteMany({})
  await ProductUserCounter.deleteMany({})
  // console.log('Database reset!')
}

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

const getInstructionsOfProduct = async (productID) => {
  const result = await api.get(`/api/products/${productID}`)
  return result.body.instructions
}

const getStatistics = async (token) => {
  const result = await api
    .get('/api/statistics')
    .set('Authorization', `bearer ${token}`)
  return result
}


const addNewProduct = async (newProduct, token) => {
  const result = await api
    .post('/api/products')
    .set('Authorization', `bearer ${token}`)
    .send(newProduct)
  return result
}

const addNewUser = async (newUser) => {
  return await api
    .post('/api/users')
    .send(newUser)
}

const removeProduct = async (productId, token) => {
  const result = api
    .delete(`/api/products/${productId}`)
    .set('Authorization', `bearer ${token}`)
    .send()
    .expect('Content-Type', /application\/json/)
  return result
}

const addFavourite = async (productId, token) => {
  const result = await api
    .post('/api/users/products/' + productId)
    .set('Authorization', `bearer ${token}`)
    .set('Content-Type', 'application/json')
    .expect('Content-Type', /application\/json/)
  return result
}

const removeFavourite = async (productId, token) => {
  const result = await api
    .put('/api/users/products/' + productId)
    .set('Authorization', `bearer ${token}`)
    .set('Content-Type', 'application/json')
    .expect('Content-Type', /application\/json/)
  return result
}

const addInstruction = async (productID, token, instruction) => {
  const result = await api.
    post(`/api/products/${productID}/instructions`)
    .set('Authorization', 'bearer ' + token)
    .set('Content-Type', 'application/json')
    .send(instruction)
    .expect('Content-Type', /application\/json/)
  return result
}


const deleteInstruction = async (productID, token, instructionID) => {
  const result = await api
    .delete(`/api/products/${productID}/instructions/${instructionID}`)
    .set('Authorization', 'bearer ' + token)
    .expect('Content-Type', /application\/json/)
  return result
}


const likeInstruction = async (instructionId, token) => {
  const result = await api
    .post('/api/users/likes/' + instructionId)
    .set('Authorization', `bearer ${token}`)
    .set('Content-Type', 'application/json')
    .expect(STATUS_CODES.OK)
    .expect('Content-Type', /application\/json/)
  return result
}

const unLikeInstruction = async (instructionId, token) => {
  const result = await api
    .put('/api/users/likes/' + instructionId)
    .set('Authorization', `bearer ${token}`)
    .set('Content-Type', 'application/json')
    .expect(STATUS_CODES.OK)
    .expect('Content-Type', /application\/json/)
  return result
}

const disLikeInstruction = async (instructionId, token) => {
  const result = await api
    .post('/api/users/dislikes/' + instructionId)
    .set('Authorization', `bearer ${token}`)
    .set('Content-Type', 'application/json')
    .expect(STATUS_CODES.OK)
    .expect('Content-Type', /application\/json/)
  return result
}

const unDisLikeInstruction = async (instructionId, token) => {
  const result = await api
    .put('/api/users/dislikes/' + instructionId)
    .set('Authorization', `bearer ${token}`)
    .set('Content-Type', 'application/json')
    .expect(STATUS_CODES.OK)
    .expect('Content-Type', /application\/json/)
  return result
}

const recycleProductOnce = async (productID, token) => {
  const content = {
    productID: productID,
    amount: 1,
    type: REQUEST_TYPE.RECYCLE
  }
  const result = await api
    .post('/api' + counterURLS.BASE_URL + counterURLS.UPDATE_PRODUCT_USER_COUNT)
    .set('Authorization', `bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send(content)
  return result
}

const unrecycleProductOnce = async (productID, token) => {
  const content = {
    productID: productID,
    amount: -1,
    type: REQUEST_TYPE.RECYCLE
  }
  const result = await api
    .post('/api' + counterURLS.BASE_URL + counterURLS.UPDATE_PRODUCT_USER_COUNT)
    .set('Authorization', `bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send(content)
  return result
}

const recycleProductFreeAmount = async (productID, amount, token) => {
  const content = {
    productID: productID,
    amount: amount,
    type: REQUEST_TYPE.RECYCLE
  }
  const result = await api
    .post('/api' + counterURLS.BASE_URL + counterURLS.UPDATE_PRODUCT_USER_COUNT)
    .set('Authorization', `bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send(content)
  return result
}
const purchaseProductOnce = async (productID, token) => {
  const content = {
    productID: productID,
    amount: 1,
    type: REQUEST_TYPE.PURCHASE
  }
  const result = await api
    .post('/api' + counterURLS.BASE_URL + counterURLS.UPDATE_PRODUCT_USER_COUNT)
    .set('Authorization', `bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send(content)
  return result
}

const unPurchaseProductOnce = async (productID, token) => {
  const content = {
    productID: productID,
    amount: -1,
    type: REQUEST_TYPE.PURCHASE
  }
  const result = await api
    .post('/api' + counterURLS.BASE_URL + counterURLS.UPDATE_PRODUCT_USER_COUNT)
    .set('Authorization', `bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send(content)
  return result
}

const purchaseProductFreeAmount = async (productID, amount, token) => {
  const content = {
    productID: productID,
    amount: amount,
    type: REQUEST_TYPE.PURCHASE
  }
  const result = await api
    .post('/api' + counterURLS.BASE_URL + counterURLS.UPDATE_PRODUCT_USER_COUNT)
    .set('Authorization', `bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send(content)
  return result
}

const getProductUserCounts = async (productID, token) => {
  const result = await api.get('/api' + counterURLS.BASE_URL + counterURLS.GET_PRODUCT_USER_COUNT + '/?productID=' + productID)
    .set('Authorization', `bearer ${token}`)
  return result
}

module.exports = {
  clearDatabase,
  usersInDb,
  getToken,
  productsData,
  getProducts,
  getStatistics,
  addInstruction,
  likeInstruction,
  disLikeInstruction,
  unLikeInstruction,
  unDisLikeInstruction,
  addFavourite,
  removeFavourite,
  addNewProduct,
  removeProduct,
  recycleProductOnce,
  unrecycleProductOnce,
  recycleProductFreeAmount,
  purchaseProductOnce,
  unPurchaseProductOnce,
  purchaseProductFreeAmount,
  getProductUserCounts,
  addNewUser,
  getInstructionsOfProduct,
  deleteInstruction,
}