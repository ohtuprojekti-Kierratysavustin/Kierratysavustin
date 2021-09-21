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
const helper = require('./test_helper')

let token = undefined
let user = undefined

beforeAll(async () => {
  const passwordHash = await bcrypt.hash('salasana', 10)
  user = new User({ username: 'root', passwordHash })
})

beforeEach(async () => {
  await Product.deleteMany({})
  await Instruction.deleteMany({})

  let productObject = new Product({ name:helper.productsData[0].name, user:user.id })
  let instructionObject = new Instruction({
    information: 'Muovi',
    product: productObject.id
  })
  productObject.instructions = productObject.instructions.concat(instructionObject.id)
  await instructionObject.save()
  await productObject.save()

  productObject = new Product({ name:helper.productsData[1].name, user:user.id })
  await productObject.save()
})

test('products are returned as json', async () => {
  await api
    .get('/api/products')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all products are returned', async () => {
  const response = await helper.getProducts()

  expect(response.body).toHaveLength(helper.productsData.length)
})

test('all products instructions are ordered by score', async () => {
  const passwordHash = await bcrypt.hash('testing', 10)
  let user = new User({ username: 'testing', passwordHash })

  await user.save()
  user = {
    username: 'testing',
    password: 'testing',
  }

  token = await helper.getToken(user)
  let allProducts = await helper.getProducts()
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
  await helper.addInstruction(product, token, newInstruction1)
  await helper.addInstruction(product, token, newInstruction2)
  await helper.addInstruction(product, token, newInstruction3)
  
  allProducts = await helper.getProducts()
  
  const firstInstructionAtStart = allProducts.body[1].instructions[0].id
  const secondInstructionAtStart = allProducts.body[1].instructions[1].id
  const thirdInstructionAtStart = allProducts.body[1].instructions[2].id
  
  await helper.likeInstruction(allProducts.body[1].instructions[2].id, token)
  await helper.disLikeInstruction(allProducts.body[1].instructions[0].id, token)
  allProducts = await helper.getProducts()

  expect(allProducts.body[1].instructions[0].id).toBe(thirdInstructionAtStart)
  expect(allProducts.body[1].instructions[1].id).toBe(secondInstructionAtStart)
  expect(allProducts.body[1].instructions[2].id).toBe(firstInstructionAtStart)
})

test('known existing product is in all products', async () => {
  const response = await helper.getProducts()
  const contents = response.body.map((r) => r.name)

  expect(contents).toContain('Mustamakkarakastike pullo')
})

test('known existing instruction contains information and score', async () => {
  const response = await helper.getProducts()
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

describe('Schema is validated correctly', () => {
  // Tarkastetaan että skeeman validointi on kunnossa
  test('Product must have fields name and user', async () => {
    //const passwordHash = await bcrypt.hash('salasana', 10)
    //const user = new User({ username: 'root', passwordHash })
    let error = null

    // käyttäjä puuttuu
    try {
      const product = new Product({ name:'name field', })
      await product.validate()
    } catch(e) {
      error = e
    }
    
    // nimi puuttuu
    try {
      const product = new Product({ user:user.id, })
      await product.validate()
    } catch(e) {
      error = e
    }
    expect(error).not.toBeNull()

    // tämän pitäisi mennä läpi
    error = null
    try {
      const product = new Product({ name:'name field', user: user.id })
      await product.validate()
    } catch(e) {
      error = e
    }
    expect(error).toBeNull()
  })
}) 

describe('One account already in database', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('salasana', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })
  test('account can be made with new username', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'admin',
      password: 'adminn',
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  })

  test('user can login', async () => {
    const user = {
      username: 'root',
      password: 'salasana',
    }

    token = await helper.getToken(user)
    expect(token).not.toBe(undefined)
  })

  describe('User logged in', () => {
    beforeEach(async () => {
      const user = {
        username: 'root',
        password: 'salasana',
      }
      token = await helper.getToken(user)
    })

    test('Product can be added', async () => {
      const newProduct = {
        name: 'makkarakastike',
      }

      await helper.addNewProduct(newProduct, token)
 
      const allProducts = await helper.getProducts()
      expect(allProducts.body).toHaveLength(helper.productsData.length + 1)
    })

    test('Product can be removed by creator', async () => {
      const newProduct = await helper.addNewProduct({ name: 'litran mitta' }, token)
      await helper.removeProduct(newProduct.body.id, token)
      let allProducts = await helper.getProducts()

      allProducts.body.map(p => expect(p.name).not.toContain(newProduct.body.name))
    })

    test('Product cannot be removed by non-creator', async () => {
      const allProducts = await helper.getProducts()
      let productId = allProducts.body[0].id

      await api
        .delete(`/api/products/${productId}`)
        .set('Authorization', `bearer ${token}`)
        .send()
        .expect(403)
      
      const productsAfter = await helper.getProducts()
      expect(productsAfter.body).toHaveLength(helper.productsData.length)
    })

    test('user can add instruction for product', async () => {
      const newInstruction = {
        information: 'maito',
      }
      const allProducts = await helper.getProducts()
      const product = allProducts.body[0]
      const result = await helper.addInstruction(product, token, newInstruction)
      expect(result.body.information).toBe(newInstruction.information)
  
    })

    test('user can add products to favourites', async () => {
      const allProducts = await helper.getProducts()
      const product = allProducts.body[0]

      const result = await helper.addFavourite(product.id, token)

      const decodedToken = jwt.verify(token, config.SECRET)
      expect(result.body.users[0]).toBe(decodedToken.id)
    })

    test('user can remove products from favorites', async () => {
      const allProducts = await helper.getProducts()
      const product = allProducts.body[0]

      // Lisätään
      const result = await helper.addFavourite(product.id, token)
    
      const decodedToken = jwt.verify(token, config.SECRET)
      expect(result.body.users[0]).toBe(decodedToken.id)

      // Lisätään poistetaan

      const resultB = await helper.removeFavourite(product.id, token)

      expect(resultB.body.users[0]).not.toBe(decodedToken.id)
    })

    test('user can like an instruction', async () => {
      const allProducts = await helper.getProducts()
      const instruction = allProducts.body[0].instructions[0]

      const result = await helper.likeInstruction(instruction.id, token)

      const decodedToken = jwt.verify(token, config.SECRET)
      const user = await User.findById(decodedToken.id)
      expect(result.body.score).toBe(1)
      expect(JSON.stringify(user.likes[0])).toBe(JSON.stringify(instruction.id))
    })

    test('user can dislike an instruction', async () => {
      const allProducts = await helper.getProducts()
      const instruction = allProducts.body[0].instructions[0]
      
      const result = await helper.disLikeInstruction(instruction.id, token)

      const decodedToken = jwt.verify(token, config.SECRET)
      const user = await User.findById(decodedToken.id)
      expect(result.body.score).toBe(-1)
      expect(JSON.stringify(user.dislikes[0])).toBe(JSON.stringify(instruction.id))
    })

    test('user can remove a like from an instruction', async () => {
      const allProducts = await helper.getProducts()
      const instruction = allProducts.body[0].instructions[0]

      //lisätään
      let result = await helper.likeInstruction(instruction.id, token)
      
      const decodedToken = jwt.verify(token, config.SECRET)
      let user = await User.findById(decodedToken.id)
      expect(result.body.score).toBe(1)
      expect(JSON.stringify(user.likes[0])).toBe(JSON.stringify(instruction.id))

      //poistetaan
      result = await helper.unLikeInstruction(instruction.id, token)
      
      user = await User.findById(decodedToken.id)
      expect(result.body.score).toBe(0)
      expect(JSON.stringify(user.likes[0])).not.toBe(JSON.stringify(instruction.id))
    })

    test('user can remove a dislike from an instruction', async () => {
      const allProducts = await helper.getProducts()
      const instruction = allProducts.body[0].instructions[0]

      //lisätään
      let result = await helper.disLikeInstruction(instruction.id, token)
      
      const decodedToken = jwt.verify(token, config.SECRET)
      let user = await User.findById(decodedToken.id)
      expect(result.body.score).toBe(-1)
      expect(JSON.stringify(user.dislikes[0])).toBe(JSON.stringify(instruction.id))

      //poistetaan
      result = await helper.unDisLikeInstruction(instruction.id, token)
      
      user = await User.findById(decodedToken.id)
      expect(result.body.score).toBe(0)
      expect(JSON.stringify(user.dislikes[0])).not.toBe(JSON.stringify(instruction.id))
    })

    test('user can like an instruction after it has been disliked', async () => {
      const allProducts = await helper.getProducts()
      const instruction = allProducts.body[0].instructions[0]

      //eitykätään
      let result = await helper.disLikeInstruction(instruction.id, token)
      
      const decodedToken = jwt.verify(token, config.SECRET)
      let user = await User.findById(decodedToken.id)
      expect(result.body.score).toBe(-1)
      expect(JSON.stringify(user.dislikes[0])).toBe(JSON.stringify(instruction.id))

      //tykätään
      result = await helper.likeInstruction(instruction.id, token)
      
      user = await User.findById(decodedToken.id)
      expect(result.body.score).toBe(1)
      expect(JSON.stringify(user.dislikes[0])).not.toBe(JSON.stringify(instruction.id))
      expect(JSON.stringify(user.likes[0])).toBe(JSON.stringify(instruction.id))
    })

    test('user can dislike an instruction after it has been liked', async () => {
      const allProducts = await helper.getProducts()
      const instruction = allProducts.body[0].instructions[0]

      //tykätään
      let result = await helper.likeInstruction(instruction.id, token)
      
      const decodedToken = jwt.verify(token, config.SECRET)
      let user = await User.findById(decodedToken.id)
      expect(result.body.score).toBe(1)
      expect(JSON.stringify(user.likes[0])).toBe(JSON.stringify(instruction.id))

      //eitykätään
      result = await helper.disLikeInstruction(instruction.id, token)
      
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
