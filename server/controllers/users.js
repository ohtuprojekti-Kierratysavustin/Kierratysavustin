const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const userRouter = require('express').Router()
const User = require('../models/user')
const Product = require('../models/product')
const Instruction = require('../models/instruction')
const authUtils = require('../utils/auth')
const STATUS_CODES = require('http-status')
const { restructureCastAndValidationErrorsFromMongoose, ResourceNotFoundException } = require('../error/exceptions')

userRouter.post('/', async (req, res, next) => {
  try {
    const body = req.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    const user = new User({
      username: body.username,
      passwordHash,
    })

    const savedUser = await user.save()
    res.status(STATUS_CODES.CREATED).json({ message: 'Rekisteröityminen onnistui!', resource: savedUser })
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    // To the errorhandler in app.js
    next(handledError)
  }
})

userRouter.post('/instructions/like', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)

    const session = await mongoose.startSession()

    let userLikes      // withTransaction does not return a value for some reason: https://jira.mongodb.org/browse/NODE-2014
    let userDislikes   // so using these to return values
    let instructionRet
    let responseMessage = 'Ohjeesta tykätty!'

    await session.withTransaction(async () => {

      const instruction = await Instruction.findById(req.body.instructionID).select('score')
      if (!instruction) {
        throw new ResourceNotFoundException('Ohjetta ID:llä: ' + req.body.instructionID + ' ei löytynyt!')
      }

      if (user.likes.includes(instruction.id)) {
        user.likes = user.likes.pull({ _id: instruction.id })
        instruction.score = instruction.score - 1
        responseMessage = 'Ohjeen tykkäys poistettu!'
      } else if (user.dislikes.includes(instruction.id)) {
        user.dislikes = user.dislikes.pull({ _id: instruction.id })
        user.likes = user.likes.concat(instruction.id)
        instruction.score = instruction.score + 2
      } else {
        user.likes = user.likes.concat(instruction.id)
        instruction.score = instruction.score + 1
      }

      await instruction.save()
      await user.save()
      userLikes = user.likes
      userDislikes = user.dislikes
      instructionRet = instruction
      return Promise.resolve()
    })

    res.status(STATUS_CODES.OK).json({ message: responseMessage, resource: { likes: userLikes, dislikes: userDislikes, instruction: instructionRet } })
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    // To the errorhandler in app.js
    next(handledError)
  }
})

userRouter.get('/instructions/likes/', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)

    return res.status(STATUS_CODES.OK).json(user.likes)
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    // To the errorhandler in app.js
    next(handledError)
  }
})

userRouter.post('/instructions/dislike', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)

    const session = await mongoose.startSession()

    let userLikes      // withTransaction does not return a value for some reason: https://jira.mongodb.org/browse/NODE-2014
    let userDislikes   // so using these to return values
    let instructionRet
    let responseMessage = 'Ohjeesta ei-tykätty!'


    await session.withTransaction(async () => {

      const instruction = await Instruction.findById(req.body.instructionID).select('score')
      if (!instruction) {
        throw new ResourceNotFoundException('Ohjetta ID:llä: ' + req.body.instructionID + ' ei löytynyt!')
      }

      if (user.likes.includes(instruction.id)) {
        user.likes = user.likes.pull({ _id: instruction.id })
        user.dislikes = user.dislikes.concat(instruction.id)
        instruction.score = instruction.score - 2
      } else if (user.dislikes.includes(instruction.id)) {
        user.dislikes = user.dislikes.pull({ _id: instruction.id })
        instruction.score = instruction.score + 1
        responseMessage = 'Ohjeen ei-tykkäys poistettu!'
      } else {
        user.dislikes = user.dislikes.concat(instruction.id)
        instruction.score = instruction.score - 1
      }

      await instruction.save()
      await user.save()
      userLikes = user.likes
      userDislikes = user.dislikes
      instructionRet = instruction
      return Promise.resolve()
    }).then((instruction) => { return instruction })

    res.status(STATUS_CODES.OK).json({ message: responseMessage, resource: { likes: userLikes, dislikes: userDislikes, instruction: instructionRet } })
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    // To the errorhandler in app.js
    next(handledError)
  }
})

userRouter.get('/instructions/dislikes/', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)

    return res.status(STATUS_CODES.OK).json(user.dislikes)
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    // To the errorhandler in app.js
    next(handledError)
  }
})

userRouter.post('/products/:id/', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)

    const product = await Product
      .findById(req.params.id)
      .populate({
        path: 'instructions'
      }).exec()
    if (!product) {
      throw new ResourceNotFoundException('Tuotetta ID:llä: ' + req.params.id + ' ei löytynyt!')
    }

    product.instructions.sort((a, b) => b.score - a.score)

    if (user.favoriteProducts.includes(user.id)) {
      throw new ResourceNotFoundException('Tuote löytyy jo suosikeista!')
    }

    user.favoriteProducts = user.favoriteProducts.concat(product.id)
    await user.save()
    res.status(STATUS_CODES.OK).json({ message: 'Tuote \'' + product.name + ' \' lisätty suosikkeihin!', resource: product })
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    // To the errorhandler in app.js
    next(handledError)
  }
})

userRouter.put('/products/:id', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)

    const product = await Product
      .findById(req.params.id)
      .populate({
        path: 'instructions'
      }).exec()
    if (!product) {
      throw new ResourceNotFoundException('Tuotetta ID:llä: ' + req.params.id + ' ei löytynyt!')
    }

    product.instructions.sort((a, b) => b.score - a.score)

    if (!user.favoriteProducts.includes(product.id)) {
      throw new ResourceNotFoundException('Tuote ei löydy suosikeista!')
    }

    user.favoriteProducts = user.favoriteProducts.pull({ _id: product.id })
    await user.save()
    res.status(STATUS_CODES.OK).json({ message: 'Tuote \'' + product.name + ' \' poistettu suosikeista!', resource: product })
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    // To the errorhandler in app.js
    next(handledError)
  }
})


module.exports = userRouter
