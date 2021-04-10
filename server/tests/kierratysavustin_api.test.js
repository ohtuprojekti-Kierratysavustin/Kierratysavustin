const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const Product = require('../models/product')
const User = require('../models/user')
const Instruction = require('../models/instruction')

let token = undefined
const productsData = [
  { name: 'Mustamakkarakastike pullo' },
  {
    name: 'Sanomalehti',
  },
]

beforeEach(async () => {
  await Product.deleteMany({})
  await Instruction.deleteMany({})

  let productObject = new Product(productsData[0])
  let instructionObject = new Instruction({
    information: 'Muovi',
    product: productObject.id
  })
  productObject.instructions = productObject.instructions.concat(instructionObject.id)
  await instructionObject.save()
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

test('all products instructions are ordered by score', async () => {
  const user = {
    username: 'root',
    password: 'salasana',
  }

  token = await getToken(user)
  let allProducts = await api.get('/api/products')
  const newInstruction1 = {
    information: 'first',
  }
  const newInstruction2 = {
    information: 'second',
  }
  const newInstruction3 = {
    information: 'third',
  }
  const product = allProducts.body[1]
  await api.
    post(`/api/products/${product.id}/instructions`)
    .set('Authorization', 'bearer ' + token)
    .set('Content-Type',  'application/json')
    .send(newInstruction1)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  await api.
    post(`/api/products/${product.id}/instructions`)
    .set('Authorization', 'bearer ' + token)
    .set('Content-Type',  'application/json')
    .send(newInstruction2)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  await api.
    post(`/api/products/${product.id}/instructions`)
    .set('Authorization', 'bearer ' + token)
    .set('Content-Type',  'application/json')
    .send(newInstruction3)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  allProducts = await api.get('/api/products')
  
  const firstInstructionAtStart = allProducts.body[1].instructions[0].id
  const secondInstructionAtStart = allProducts.body[1].instructions[1].id
  const thirdInstructionAtStart = allProducts.body[1].instructions[2].id
  

  await api
    .post('/api/users/likes/' + allProducts.body[1].instructions[2].id)
    .set('Authorization', `bearer ${token}`)
    .set('Content-Type',  'application/json')
    .expect(201)
    .expect('Content-Type', /application\/json/)

  await api
    .post('/api/users/dislikes/' + allProducts.body[1].instructions[0].id)
    .set('Authorization', `bearer ${token}`)
    .set('Content-Type',  'application/json')
    .expect(201)
    .expect('Content-Type', /application\/json/)

  allProducts = await api.get('/api/products')

  expect(allProducts.body[1].instructions[0].id).toBe(thirdInstructionAtStart)
  expect(allProducts.body[1].instructions[1].id).toBe(secondInstructionAtStart)
  expect(allProducts.body[1].instructions[2].id).toBe(firstInstructionAtStart)
})

test('known existing product is in all products', async () => {
  const response = await api.get('/api/products')
  const contents = response.body.map((r) => r.name)

  expect(contents).toContain('Mustamakkarakastike pullo')
})

test('known existing instruction contains information and score', async () => {
  const response = await api.get('/api/products')
  const instruction = response.body[0].instructions[0]
  expect(instruction.score).toBe(0)
  expect(instruction.information).toBe('Muovi')
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

    token = await getToken(user)
    //console.log(token)
    expect(token).not.toBe(undefined)
  })

  describe('User logged in', () => {
    beforeEach(async () => {
      const user = {
        username: 'root',
        password: 'salasana',
      }
      token = await getToken(user)
    })

    test('Product can be added', async () => {
      const newProduct = {
        name: 'makkarakastike',
      }

      await api
        .post('/api/products')
        .set('Authorization', `bearer ${token}`)
        .send(newProduct)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      
      const allProducts = await api.get('/api/products')
      expect(allProducts.body).toHaveLength(productsData.length + 1)
    })

    test('user can add instruction for product', async () => {
      const newInstruction = {
        information: 'maito',
      }
      const allProducts = await api.get('/api/products')
      const product = allProducts.body[0]
      const result = await api.
        post(`/api/products/${product.id}/instructions`)
        .set('Authorization', 'bearer ' + token)
        .set('Content-Type',  'application/json')
        .send(newInstruction)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      expect(result.body.information).toBe(newInstruction.information)
  
    })

    test('user can add products to favourites', async () => {

      const allProducts = await api.get('/api/products')
      const product = allProducts.body[0]

      const result = await api
        .post('/api/users/products/' + product.id)
        .set('Authorization', `bearer ${token}`)
        .set('Content-Type',  'application/json')
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const decodedToken = jwt.verify(token, config.SECRET)
      expect(result.body.users[0]).toBe(decodedToken.id)
    })

    test('user can remove products from favorites', async () => {

      const allProducts = await api.get('/api/products')
      const product = allProducts.body[0]

      // Lisätään
    
      const result = await api
        .post('/api/users/products/' + product.id)
        .set('Authorization', `bearer ${token}`)
        .set('Content-Type',  'application/json')
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const decodedToken = jwt.verify(token, config.SECRET)
      expect(result.body.users[0]).toBe(decodedToken.id)

      // Lisätään poistetaan

      const resultB = await api
        .put('/api/users/products/' + product.id)
        .set('Authorization', `bearer ${token}`)
        .set('Content-Type',  'application/json')
        .expect(201)
        .expect('Content-Type', /application\/json/)

      expect(resultB.body.users[0]).not.toBe(decodedToken.id)
    })

    test('user can like an instruction', async () => {

      const allProducts = await api.get('/api/products')
      const instruction = allProducts.body[0].instructions[0]

      const result = await api
        .post('/api/users/likes/' + instruction.id)
        .set('Authorization', `bearer ${token}`)
        .set('Content-Type',  'application/json')
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const decodedToken = jwt.verify(token, config.SECRET)
      const user = await User.findById(decodedToken.id)
      expect(result.body.score).toBe(1)
      expect(JSON.stringify(user.likes[0])).toBe(JSON.stringify(instruction.id))
    })

    test('user can dislike an instruction', async () => {

      const allProducts = await api.get('/api/products')
      const instruction = allProducts.body[0].instructions[0]

      const result = await api
        .post('/api/users/dislikes/' + instruction.id)
        .set('Authorization', `bearer ${token}`)
        .set('Content-Type',  'application/json')
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const decodedToken = jwt.verify(token, config.SECRET)
      const user = await User.findById(decodedToken.id)
      expect(result.body.score).toBe(-1)
      expect(JSON.stringify(user.dislikes[0])).toBe(JSON.stringify(instruction.id))
    })

    test('user can remove a like from an instruction', async () => {

      const allProducts = await api.get('/api/products')
      const instruction = allProducts.body[0].instructions[0]

      //lisätään
      let result = await api
        .post('/api/users/likes/' + instruction.id)
        .set('Authorization', `bearer ${token}`)
        .set('Content-Type',  'application/json')
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const decodedToken = jwt.verify(token, config.SECRET)
      let user = await User.findById(decodedToken.id)
      expect(result.body.score).toBe(1)
      expect(JSON.stringify(user.likes[0])).toBe(JSON.stringify(instruction.id))

      //poistetaan
      result = await api
        .put('/api/users/likes/' + instruction.id)
        .set('Authorization', `bearer ${token}`)
        .set('Content-Type',  'application/json')
        .expect(201)
        .expect('Content-Type', /application\/json/)

      user = await User.findById(decodedToken.id)
      expect(result.body.score).toBe(0)
      expect(JSON.stringify(user.likes[0])).not.toBe(JSON.stringify(instruction.id))
    })

    test('user can remove a dislike from an instruction', async () => {

      const allProducts = await api.get('/api/products')
      const instruction = allProducts.body[0].instructions[0]

      //lisätään
      let result = await api
        .post('/api/users/dislikes/' + instruction.id)
        .set('Authorization', `bearer ${token}`)
        .set('Content-Type',  'application/json')
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const decodedToken = jwt.verify(token, config.SECRET)
      let user = await User.findById(decodedToken.id)
      expect(result.body.score).toBe(-1)
      expect(JSON.stringify(user.dislikes[0])).toBe(JSON.stringify(instruction.id))

      //poistetaan
      result = await api
        .put('/api/users/dislikes/' + instruction.id)
        .set('Authorization', `bearer ${token}`)
        .set('Content-Type',  'application/json')
        .expect(201)
        .expect('Content-Type', /application\/json/)

      user = await User.findById(decodedToken.id)
      expect(result.body.score).toBe(0)
      expect(JSON.stringify(user.dislikes[0])).not.toBe(JSON.stringify(instruction.id))
    })

    test('user can like an instruction after it has been disliked', async () => {

      const allProducts = await api.get('/api/products')
      const instruction = allProducts.body[0].instructions[0]

      //eitykätään
      let result = await api
        .post('/api/users/dislikes/' + instruction.id)
        .set('Authorization', `bearer ${token}`)
        .set('Content-Type',  'application/json')
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const decodedToken = jwt.verify(token, config.SECRET)
      let user = await User.findById(decodedToken.id)
      expect(result.body.score).toBe(-1)
      expect(JSON.stringify(user.dislikes[0])).toBe(JSON.stringify(instruction.id))

      //tykätään
      result = await api
        .post('/api/users/likes/' + instruction.id)
        .set('Authorization', `bearer ${token}`)
        .set('Content-Type',  'application/json')
        .expect(201)
        .expect('Content-Type', /application\/json/)

      user = await User.findById(decodedToken.id)
      expect(result.body.score).toBe(1)
      expect(JSON.stringify(user.dislikes[0])).not.toBe(JSON.stringify(instruction.id))
      expect(JSON.stringify(user.likes[0])).toBe(JSON.stringify(instruction.id))
    })

    test('user can dislike an instruction after it has been liked', async () => {

      const allProducts = await api.get('/api/products')
      const instruction = allProducts.body[0].instructions[0]

      //tykätään
      let result = await api
        .post('/api/users/likes/' + instruction.id)
        .set('Authorization', `bearer ${token}`)
        .set('Content-Type',  'application/json')
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const decodedToken = jwt.verify(token, config.SECRET)
      let user = await User.findById(decodedToken.id)
      expect(result.body.score).toBe(1)
      expect(JSON.stringify(user.likes[0])).toBe(JSON.stringify(instruction.id))

      //eitykätään
      result = await api
        .post('/api/users/dislikes/' + instruction.id)
        .set('Authorization', `bearer ${token}`)
        .set('Content-Type',  'application/json')
        .expect(201)
        .expect('Content-Type', /application\/json/)

      user = await User.findById(decodedToken.id)
      expect(result.body.score).toBe(-1)
      expect(JSON.stringify(user.dislikes[0])).toBe(JSON.stringify(instruction.id))
      expect(JSON.stringify(user.likes[0])).not.toBe(JSON.stringify(instruction.id))
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
