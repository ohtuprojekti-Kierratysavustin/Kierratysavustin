const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const Product = require('../models/product')
const User = require('../models/user')
const Instruction = require('../models/instruction')
const helper = require('./test_helper')
const STATUS_CODES = require('http-status')

let loginData = undefined
let user = undefined

beforeAll(async () => {
  await helper.clearDatabase()
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
  let productObject = new Product({ name: helper.productsData[0].name,  creator:user.id })
  let instructionObject = new Instruction({
    information: 'Muovi',
    product: productObject.id,
    creator:user.id
  })
  await productObject.save()
  //console.log('Product 1 initialized for test', productObject)
  await instructionObject.save()
  //console.log('Instruction 1 initialized for test', instructionObject)


  productObject = new Product({ name: helper.productsData[1].name,  creator:user.id })
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

  loginData = await helper.login(user)
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
  await helper.addInstruction(product.id, loginData.token, newInstruction1)
  await helper.addInstruction(product.id, loginData.token, newInstruction2)
  await helper.addInstruction(product.id, loginData.token, newInstruction3)

  allProducts = await helper.getProducts()

  const firstInstructionAtStart = allProducts.body[1].instructions[0].id
  const secondInstructionAtStart = allProducts.body[1].instructions[1].id
  const thirdInstructionAtStart = allProducts.body[1].instructions[2].id

  await helper.likeInstruction(allProducts.body[1].instructions[2].id, loginData.token)
  await helper.disLikeInstruction(allProducts.body[1].instructions[0].id, loginData.token)
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
  expect(response.status).toBe(STATUS_CODES.UNAUTHORIZED)
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
      const product = new Product({  creator: user.id, })
      await product.validate()
    } catch (e) {
      error = e
    }
    expect(error).not.toBeNull()

    // tämän pitäisi mennä läpi
    error = null
    try {
      const product = new Product({ name: 'name field',  creator: user.id })
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
    expect(response.status).toBe(STATUS_CODES.CREATED)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  })

  test('user can login', async () => {
    const user = {
      username: 'root',
      password: 'salasana',
    }

    loginData = await helper.login(user)
    expect(loginData.token).not.toBe(undefined)
  })

  describe('User logged in', () => {
    beforeEach(async () => {
      const user = {
        username: 'root',
        password: 'salasana',
      }
      loginData = await helper.login(user)
      //console.log('token initalized for test: ', loginData.token)
    })

    test('Product can be added', async () => {
      const newProduct = {
        name: 'makkarakastike',
      }

      await helper.addNewProduct(newProduct, loginData.token)

      const allProducts = await helper.getProducts()
      expect(allProducts.body).toHaveLength(helper.productsData.length + 1)
    })

    test('Product can be removed by creator', async () => {
      const newProductRes = await helper.addNewProduct({ name: 'litran mitta' }, loginData.token)
      let response = await helper.removeProduct(newProductRes.body.resource.id, loginData.token)
      expect(response.status).toBe(STATUS_CODES.OK)
      let allProducts = await helper.getProducts()

      allProducts.body.map(p => expect(p.name).not.toContain(newProductRes.body.resource.name))
    })

    test('Product cannot be removed by non-creator', async () => {
      const allProducts = await helper.getProducts()
      let productId = allProducts.body[0].id

      let response = await helper.removeProduct(productId, loginData.token)
      expect(response.status).toBe(STATUS_CODES.FORBIDDEN)

      const productsAfter = await helper.getProducts()
      expect(productsAfter.body).toHaveLength(helper.productsData.length)
    })

    // Product favourites 
    ///////////////////////////////////////////////////////////////////////////////////////////
    test('user can add products to favourites', async () => {
      const allProducts = await helper.getProducts()
      const product = allProducts.body[0]

      const response = await helper.addFavourite(product.id, loginData.token)
      expect(response.status).toBe(STATUS_CODES.OK)
      
      expect(response.body.resource.id).toBe(product.id)

      const favoritesResponse = await helper.getFavorites(loginData.token)

      expect(favoritesResponse.body[0].id).toBe(product.id)
    })

    test('user can remove products from favorites', async () => {
      const allProducts = await helper.getProducts()
      const product = allProducts.body[0]

      // Lisätään
      const response = await helper.addFavourite(product.id, loginData.token)
      expect(response.status).toBe(STATUS_CODES.OK)

      // poistetaan

      const responseB = await helper.removeFavourite(product.id, loginData.token)
      expect(responseB.status).toBe(STATUS_CODES.OK)

      const favoritesResponse = await helper.getFavorites(loginData.token)

      expect(favoritesResponse.body.length).toBe(0)
      // expect(responseB.body.resource.users[0]).not.toBe(decodedToken.id)
    })

    // Instructions
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    test('user can add instruction for product', async () => {
      const newInstruction = {
        information: 'maito',
      }
      const allProducts = await helper.getProducts()
      const product = allProducts.body[0]
      const response = await helper.addInstruction(product.id, loginData.token, newInstruction)
      expect(response.body.resource.information).toBe(newInstruction.information)

    })

    // Instruction likes
    test('user can like an instruction', async () => {
      const allProducts = await helper.getProducts()
      const instruction = allProducts.body[0].instructions[0]

      const response = await helper.likeInstruction(instruction.id, loginData.token)

      const decodedToken = jwt.verify(loginData.token, config.SECRET)
      const user = await User.findById(decodedToken.id)
      expect(response.body.resource.score).toBe(1)
      expect(JSON.stringify(user.likes[0])).toBe(JSON.stringify(instruction.id))
    })

    test('user can dislike an instruction', async () => {
      const allProducts = await helper.getProducts()
      const instruction = allProducts.body[0].instructions[0]

      const response = await helper.disLikeInstruction(instruction.id, loginData.token)

      const decodedToken = jwt.verify(loginData.token, config.SECRET)
      const user = await User.findById(decodedToken.id)
      expect(response.body.resource.score).toBe(-1)
      expect(JSON.stringify(user.dislikes[0])).toBe(JSON.stringify(instruction.id))
    })

    test('user can remove a like from an instruction', async () => {
      const allProducts = await helper.getProducts()
      const instruction = allProducts.body[0].instructions[0]

      //lisätään
      let response = await helper.likeInstruction(instruction.id, loginData.token)

      const decodedToken = jwt.verify(loginData.token, config.SECRET)
      let user = await User.findById(decodedToken.id)
      expect(response.body.resource.score).toBe(1)
      expect(JSON.stringify(user.likes[0])).toBe(JSON.stringify(instruction.id))

      //poistetaan
      response = await helper.unLikeInstruction(instruction.id, loginData.token)

      user = await User.findById(decodedToken.id)
      expect(response.body.resource.score).toBe(0)
      expect(JSON.stringify(user.likes[0])).not.toBe(JSON.stringify(instruction.id))
    })

    test('user can remove a dislike from an instruction', async () => {
      const allProducts = await helper.getProducts()
      const instruction = allProducts.body[0].instructions[0]

      //lisätään
      let response = await helper.disLikeInstruction(instruction.id, loginData.token)

      const decodedToken = jwt.verify(loginData.token, config.SECRET)
      let user = await User.findById(decodedToken.id)
      expect(response.body.resource.score).toBe(-1)
      expect(JSON.stringify(user.dislikes[0])).toBe(JSON.stringify(instruction.id))

      //poistetaan
      response = await helper.unDisLikeInstruction(instruction.id, loginData.token)

      user = await User.findById(decodedToken.id)
      expect(response.body.resource.score).toBe(0)
      expect(JSON.stringify(user.dislikes[0])).not.toBe(JSON.stringify(instruction.id))
    })

    test('user can like an instruction after it has been disliked', async () => {
      const allProducts = await helper.getProducts()
      const instruction = allProducts.body[0].instructions[0]

      //eitykätään
      let response = await helper.disLikeInstruction(instruction.id, loginData.token)

      const decodedToken = jwt.verify(loginData.token, config.SECRET)
      let user = await User.findById(decodedToken.id)
      expect(response.body.resource.score).toBe(-1)
      expect(JSON.stringify(user.dislikes[0])).toBe(JSON.stringify(instruction.id))

      //tykätään
      response = await helper.likeInstruction(instruction.id, loginData.token)

      user = await User.findById(decodedToken.id)
      expect(response.body.resource.score).toBe(1)
      expect(JSON.stringify(user.dislikes[0])).not.toBe(JSON.stringify(instruction.id))
      expect(JSON.stringify(user.likes[0])).toBe(JSON.stringify(instruction.id))
    })

    test('user can dislike an instruction after it has been liked', async () => {
      const allProducts = await helper.getProducts()
      const instruction = allProducts.body[0].instructions[0]

      //tykätään
      let response = await helper.likeInstruction(instruction.id, loginData.token)

      const decodedToken = jwt.verify(loginData.token, config.SECRET)
      let user = await User.findById(decodedToken.id)
      expect(response.body.resource.score).toBe(1)
      expect(JSON.stringify(user.likes[0])).toBe(JSON.stringify(instruction.id))

      //eitykätään
      response = await helper.disLikeInstruction(instruction.id, loginData.token)

      user = await User.findById(decodedToken.id)
      expect(response.body.resource.score).toBe(-1)
      expect(JSON.stringify(user.dislikes[0])).toBe(JSON.stringify(instruction.id))
      expect(JSON.stringify(user.likes[0])).not.toBe(JSON.stringify(instruction.id))
    })

    describe('Already one product in database', () => {

      let product
      beforeEach(async () => {
        const newProduct = {
          name: 'perunan kuori',
        }
        let res = await helper.addNewProduct(newProduct, loginData.token)
        product = res.body.resource
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

        let anotherLoginData = await helper.login(user)

        //toinen käyttäjä lisää ohjeen
        let instruction = await helper.addInstruction(product.id, anotherLoginData.token, { information: 'toisen ohje' })

        //ensimmäinen käyttäjä yrittää poistaa ohjeen
        let response = await helper.deleteInstruction(product.id, loginData.token, instruction.body.resource.id)
        expect(response.status).toBe(STATUS_CODES.FORBIDDEN)

        //tarkastetaan, että ohje ei ole poistunut
        const instructionsAfter = await helper.getInstructionsOfProduct(product.id)
        expect(instructionsAfter).toHaveLength(1)
      })


      test('user can delete an instruction they have created', async () => {
        //luodaan uusi ohje 
        let instruction = await helper.addInstruction(product.id, loginData.token, { information: 'uusi ohje' })

        //poistetaan ohje
        let response = await helper.deleteInstruction(product.id, loginData.token, instruction.body.resource.id)
        expect(response.status).toBe(STATUS_CODES.OK)

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
