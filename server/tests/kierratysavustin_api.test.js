const mongoose = require('mongoose')
//const supertest = require('supertest')
const bcrypt = require('bcrypt')
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
  //console.log('Starting to initialize test!')
  await helper.clearDatabase()

  let userObject = new User({
    username: 'kayttaja'
  })
  let user = await userObject.save()
  let productObject = new Product({ name: helper.productsData[0].name, user: user.id })
  let instructionObject = new Instruction({
    information: 'Muovi',
    product: productObject.id,
    user: user.id
  })
  productObject.instructions = productObject.instructions.concat(instructionObject.id)
  await productObject.save()
  //console.log('Product 1 initialized for test', productObject)
  await instructionObject.save()
  //console.log('Instruction 1 initialized for test', instructionObject)


  productObject = new Product({ name: helper.productsData[1].name, user: user.id })
  await productObject.save()
  //console.log('Product 1 initialized for test', productObject)
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
  await helper.addInstruction(product.id, token, newInstruction1)
  await helper.addInstruction(product.id, token, newInstruction2)
  await helper.addInstruction(product.id, token, newInstruction3)

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
  const response = await helper.addNewProduct(newProduct, 'NO_TOKEN')
  expect(response.status).toBe(401)
  const response2 = await helper.getProducts()
  expect(response2.body).toHaveLength(helper.productsData.length)
})

describe('Schema is validated correctly', () => {
  // Tarkastetaan että skeeman validointi on kunnossa
  test('Product must have fields name and user', async () => {
    //const passwordHash = await bcrypt.hash('salasana', 10)
    //const user = new User({ username: 'root', passwordHash })
    let error = null

    // käyttäjä puuttuu
    try {
      const product = new Product({ name: 'name field', })
      await product.validate()
    } catch (e) {
      error = e
    }

    // nimi puuttuu
    try {
      const product = new Product({ user: user.id, })
      await product.validate()
    } catch (e) {
      error = e
    }
    expect(error).not.toBeNull()

    // tämän pitäisi mennä läpi
    error = null
    try {
      const product = new Product({ name: 'name field', user: user.id })
      await product.validate()
    } catch (e) {
      error = e
    }
    expect(error).toBeNull()
  })
})

describe('One account already in database', () => {
  beforeEach(async () => {

    const passwordHash = await bcrypt.hash('salasana', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
    //console.log('User initialized for test: ', user)
  })
  test('account can be made with new username', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'admin',
      password: 'adminn',
    }
    const response = await helper.addNewUser(newUser)
    expect(response.status).toBe(201)

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
      //console.log('Token initalized for test: ', token)
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
      let response = await helper.removeProduct(newProduct.body.id, token)
      expect(response.status).toBe(200)
      let allProducts = await helper.getProducts()

      allProducts.body.map(p => expect(p.name).not.toContain(newProduct.body.name))
    })

    test('Product cannot be removed by non-creator', async () => {
      const allProducts = await helper.getProducts()
      let productId = allProducts.body[0].id

      let response = await helper.removeProduct(productId, token)
      expect(response.status).toBe(403)

      const productsAfter = await helper.getProducts()
      expect(productsAfter.body).toHaveLength(helper.productsData.length)
    })

    // Product favourites 
    ///////////////////////////////////////////////////////////////////////////////////////////
    test('user can add products to favourites', async () => {
      const allProducts = await helper.getProducts()
      const product = allProducts.body[0]

      const response = await helper.addFavourite(product.id, token)
      expect(response.status).toBe(201)

      const decodedToken = jwt.verify(token, config.SECRET)
      expect(response.body.users[0]).toBe(decodedToken.id)
    })

    test('user can remove products from favorites', async () => {
      const allProducts = await helper.getProducts()
      const product = allProducts.body[0]

      // Lisätään
      const response = await helper.addFavourite(product.id, token)
      expect(response.status).toBe(201)


      const decodedToken = jwt.verify(token, config.SECRET)
      expect(response.body.users[0]).toBe(decodedToken.id)

      // Lisätään poistetaan

      const responseB = await helper.removeFavourite(product.id, token)
      expect(responseB.status).toBe(201)


      expect(responseB.body.users[0]).not.toBe(decodedToken.id)
    })

    // Instructions
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    test('user can add instruction for product', async () => {
      const newInstruction = {
        information: 'maito',
      }
      const allProducts = await helper.getProducts()
      const product = allProducts.body[0]
      const response = await helper.addInstruction(product.id, token, newInstruction)
      expect(response.body.information).toBe(newInstruction.information)

    })

    // Instruction likes
    test('user can like an instruction', async () => {
      const allProducts = await helper.getProducts()
      const instruction = allProducts.body[0].instructions[0]

      const response = await helper.likeInstruction(instruction.id, token)

      const decodedToken = jwt.verify(token, config.SECRET)
      const user = await User.findById(decodedToken.id)
      expect(response.body.score).toBe(1)
      expect(JSON.stringify(user.likes[0])).toBe(JSON.stringify(instruction.id))
    })

    test('user can dislike an instruction', async () => {
      const allProducts = await helper.getProducts()
      const instruction = allProducts.body[0].instructions[0]

      const response = await helper.disLikeInstruction(instruction.id, token)

      const decodedToken = jwt.verify(token, config.SECRET)
      const user = await User.findById(decodedToken.id)
      expect(response.body.score).toBe(-1)
      expect(JSON.stringify(user.dislikes[0])).toBe(JSON.stringify(instruction.id))
    })

    test('user can remove a like from an instruction', async () => {
      const allProducts = await helper.getProducts()
      const instruction = allProducts.body[0].instructions[0]

      //lisätään
      let response = await helper.likeInstruction(instruction.id, token)

      const decodedToken = jwt.verify(token, config.SECRET)
      let user = await User.findById(decodedToken.id)
      expect(response.body.score).toBe(1)
      expect(JSON.stringify(user.likes[0])).toBe(JSON.stringify(instruction.id))

      //poistetaan
      response = await helper.unLikeInstruction(instruction.id, token)

      user = await User.findById(decodedToken.id)
      expect(response.body.score).toBe(0)
      expect(JSON.stringify(user.likes[0])).not.toBe(JSON.stringify(instruction.id))
    })

    test('user can remove a dislike from an instruction', async () => {
      const allProducts = await helper.getProducts()
      const instruction = allProducts.body[0].instructions[0]

      //lisätään
      let response = await helper.disLikeInstruction(instruction.id, token)

      const decodedToken = jwt.verify(token, config.SECRET)
      let user = await User.findById(decodedToken.id)
      expect(response.body.score).toBe(-1)
      expect(JSON.stringify(user.dislikes[0])).toBe(JSON.stringify(instruction.id))

      //poistetaan
      response = await helper.unDisLikeInstruction(instruction.id, token)

      user = await User.findById(decodedToken.id)
      expect(response.body.score).toBe(0)
      expect(JSON.stringify(user.dislikes[0])).not.toBe(JSON.stringify(instruction.id))
    })

    test('user can like an instruction after it has been disliked', async () => {
      const allProducts = await helper.getProducts()
      const instruction = allProducts.body[0].instructions[0]

      //eitykätään
      let response = await helper.disLikeInstruction(instruction.id, token)

      const decodedToken = jwt.verify(token, config.SECRET)
      let user = await User.findById(decodedToken.id)
      expect(response.body.score).toBe(-1)
      expect(JSON.stringify(user.dislikes[0])).toBe(JSON.stringify(instruction.id))

      //tykätään
      response = await helper.likeInstruction(instruction.id, token)

      user = await User.findById(decodedToken.id)
      expect(response.body.score).toBe(1)
      expect(JSON.stringify(user.dislikes[0])).not.toBe(JSON.stringify(instruction.id))
      expect(JSON.stringify(user.likes[0])).toBe(JSON.stringify(instruction.id))
    })

    test('user can dislike an instruction after it has been liked', async () => {
      const allProducts = await helper.getProducts()
      const instruction = allProducts.body[0].instructions[0]

      //tykätään
      let response = await helper.likeInstruction(instruction.id, token)

      const decodedToken = jwt.verify(token, config.SECRET)
      let user = await User.findById(decodedToken.id)
      expect(response.body.score).toBe(1)
      expect(JSON.stringify(user.likes[0])).toBe(JSON.stringify(instruction.id))

      //eitykätään
      response = await helper.disLikeInstruction(instruction.id, token)

      user = await User.findById(decodedToken.id)
      expect(response.body.score).toBe(-1)
      expect(JSON.stringify(user.dislikes[0])).toBe(JSON.stringify(instruction.id))
      expect(JSON.stringify(user.likes[0])).not.toBe(JSON.stringify(instruction.id))
    })


    // Product Recycle stats
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    describe('Product Recycling Statistics', () => {

      test('user can recycle an existing product', async () => {
        const allProducts = await helper.getProducts()
        const product = allProducts.body[0]

        await helper.recycleProductOnce(product.id, token)
        
        const response = await helper.getProductRecycleStat(product.id, token)
        expect(response.body.recycleCount).toBe(1)

      })

      test('user can recycle an existing product multiple times', async () => {
        const allProducts = await helper.getProducts()
        const product = allProducts.body[0]

        await helper.recycleProductOnce(product.id, token)
        await helper.recycleProductOnce(product.id, token)
        await helper.recycleProductOnce(product.id, token)
        await helper.recycleProductOnce(product.id, token)

        const response = await helper.getProductRecycleStat(product.id, token)
        expect(response.body.recycleCount).toBe(4)
      })

      test('user can unrecycle an existing product that has been recycled', async () => {
        const allProducts = await helper.getProducts()
        const product = allProducts.body[0]

        await helper.recycleProductOnce(product.id, token)
        await helper.recycleProductOnce(product.id, token)
        await helper.recycleProductOnce(product.id, token)
        await helper.unrecycleProductOnce(product.id, token)
        await helper.unrecycleProductOnce(product.id, token)

        const response = await helper.getProductRecycleStat(product.id, token)
        expect(response.body.recycleCount).toBe(1)
      })

      test('user can not set product recycle stat to negative', async () => {
        const allProducts = await helper.getProducts()
        const product = allProducts.body[0]

        await helper.recycleProductOnce(product.id, token)
        await helper.unrecycleProductOnce(product.id, token)
        await helper.unrecycleProductOnce(product.id, token)
        await helper.unrecycleProductOnce(product.id, token)

        const response = await helper.getProductRecycleStat(product.id, token)
        expect(response.body.recycleCount).toBe(0)
      })

      test('recycling nonexistent product responds with product 404', async () => {

        const response = await helper.recycleProductOnce('111111111111111111111111', token)
        expect(response.status).toBe(404)
      })

      test('recycling without authorization not possible', async () => {
        const allProducts = await helper.getProducts()
        const product = allProducts.body[0]

        const response = await helper.getProductRecycleStat(product.id, 'INVALID_TOKEN')
        expect(response.status).toBe(401)

      })

      test('recycling stat of nonexistent product responds with product 404', async () => {

        const response = await helper.getProductRecycleStat('111111111111111111111111', token)
        expect(response.status).toBe(404)

      })

      test('recycling stat not given without authorization', async () => {
        const allProducts = await helper.getProducts()
        const product = allProducts.body[0]

        const response = await helper.getProductRecycleStat(product.id, 'INVALID_TOKEN')
        expect(response.status).toBe(401)
      })
    })

    describe('Already one product in database', () => {

      let product
      beforeEach(async () => {
        const newProduct = {
          name: 'perunan kuori',
        }
        let res = await helper.addNewProduct(newProduct, token)
        product = res.body
      })


      test('user cannot delete an instruction made by another user', async () => {
        //toisen käyttäjän luominen
        const passwordHash = await bcrypt.hash('toinenSalasana', 10)
        let user = new User({ username: 'toinenKayttaja', passwordHash })

        await user.save()
        user = {
          username: 'toinenKayttaja',
          password: 'toinenSalasana',
        }

        let anotherToken = await helper.getToken(user)

        //toinen käyttäjä lisää ohjeen
        let instruction = await helper.addInstruction(product.id, anotherToken, { information: 'toisen ohje' })

        //ensimmäinen käyttäjä yrittää poistaa ohjeen
        let response = await helper.deleteInstruction(product.id, token, instruction.body.id)
        expect(response.status).toBe(403)

        //tarkastetaan, että ohje ei ole poistunut
        const instructionsAfter = await helper.getInstructionsOfProduct(product.id)
        expect(instructionsAfter).toHaveLength(1)
      })


      test('user can delete an instruction they have created', async () => {
        //luodaan uusi ohje 
        let instruction = await helper.addInstruction(product.id, token, { information: 'uusi ohje' })

        //poistetaan ohje
        let response = await helper.deleteInstruction(product.id, token, instruction.body.id)
        expect(response.status).toBe(201)

        //tarkastetaan, että ohje on poistettu 
        const instructionsAfter = await helper.getInstructionsOfProduct(product.id)
        expect(instructionsAfter).toHaveLength(0)
      })
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
