const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')
const STATUS_CODES = require('http-status')
const { USER_ROLES } = require('../enum/roles')
const mongoose = require('mongoose')

let loginData = undefined
let user = undefined
let admin = undefined
let moderator = undefined
let otherUser = undefined
let otherUserLoginData = undefined
let otherUserInstruction = undefined
let product = undefined
let instruction = undefined

beforeAll(async () => {
  await helper.clearDatabase()
})

beforeEach(async () => {
  await helper.clearDatabase()

  const passwordHash = await bcrypt.hash('salasana', 10)
  user = new User({ username: 'user', passwordHash: passwordHash })
  user.save()

  otherUser = new User({ username: 'otherUser', passwordHash: passwordHash })
  otherUser.save()

  moderator = new User({ username: 'moderator', passwordHash: passwordHash, role: USER_ROLES.Moderator.name })
  moderator.save()

  admin = new User({ username: 'admin', passwordHash: passwordHash, role: USER_ROLES.Admin.name })
  admin.save()

  const userLoginInfo = {
    username: 'user',
    password: 'salasana',
  }
  loginData = await helper.login(userLoginInfo)

  let res = await helper.addNewProduct({ name: helper.productsData[0].name }, loginData.token)
  product = res.body.resource

  res = await helper.addInstruction(product.id, { information: 'uusi ohje' }, loginData.token)

  instruction = res.body.resource

  const otherUserLoginInfo = {
    username: 'otherUser',
    password: 'salasana',
  }

  otherUserLoginData = await helper.login(otherUserLoginInfo)

  res = await helper.addInstruction(product.id, { information: 'Toisen käyttäjän uusi ohje' }, otherUserLoginData.token)

  otherUserInstruction = res.body.resource
})


describe('User with default role logged in', () => {
  beforeEach(async () => {
    const user = {
      username: 'user',
      password: 'salasana',
    }
    loginData = await helper.login(user)
  })

  test('Can not access Admin resource', async () => {

    let response = await helper.getAllUsers(loginData.token)

    expect(response.status).toBe(STATUS_CODES.FORBIDDEN)
  })

  test('Can not access Moderator accessible resource', async () => {
  
    let response = await helper.deleteInstruction(product.id, otherUserInstruction.id, loginData.token)

    expect(response.status).toBe(STATUS_CODES.FORBIDDEN)
  })

  test('Can access User resource', async () => {

    let response = await helper.getFavorites(loginData.token)

    expect(response.status).toBe(STATUS_CODES.OK)
  })
})

describe('User with admin role logged in', () => {
  beforeEach(async () => {
    const user = {
      username: 'admin',
      password: 'salasana',
    }
    loginData = await helper.login(user)
  })

  test('Can access Admin resource', async () => {

    let response = await helper.getAllUsers(loginData.token)

    expect(response.status).toBe(STATUS_CODES.OK)
  })

  test('Can access Moderator accessible resource', async () => {

    let response = await helper.deleteInstruction(product.id, otherUserInstruction.id, loginData.token)

    expect(response.status).toBe(STATUS_CODES.OK)
  })

  test('Can access User resource', async () => {

    let response = await helper.getFavorites(loginData.token)

    expect(response.status).toBe(STATUS_CODES.OK)
  })
})

describe('User with moderator role logged in', () => {
  beforeEach(async () => {
    const user = {
      username: 'moderator',
      password: 'salasana',
    }
    loginData = await helper.login(user)
  })

  test('Can access Moderator accessible resource', async () => {

    let response = await helper.deleteInstruction(product.id, otherUserInstruction.id, loginData.token)

    expect(response.status).toBe(STATUS_CODES.OK)
  })

  test('Can not access Admin resource', async () => {

    let response = await helper.getAllUsers(loginData.token)

    expect(response.status).toBe(STATUS_CODES.FORBIDDEN)
  })

  test('Can access User resource', async () => {

    let response = await helper.getFavorites(loginData.token)

    expect(response.status).toBe(STATUS_CODES.OK)
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



