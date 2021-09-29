const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')
const Product = require('../models/product')
const Instruction = require('../models/instruction')
const authUtils = require('../utils/auth')
const STATUS_CODES = require('http-status')

userRouter.post('/', async (req, res, next) => {
  try {
    try {
      const body = req.body
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(body.password, saltRounds)
      const user = new User({
        username: body.username,
        passwordHash,
      })
      const savedUser = await user.save()
      res.status(STATUS_CODES.CREATED).json(savedUser)
    } catch (error) {
      return res.status(STATUS_CODES.BAD_REQUEST).send('already in use')
    }
  } catch (error) {
    next(error)
  }
})

userRouter.post('/likes/:id/', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)

    const instruction = await Instruction.findById(req.params.id)
    if (!instruction) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: 'No instruction' })
    }

    if (user.likes.includes(instruction.id)) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: 'Instruction already in users likes' })
    }

    if (user.dislikes.includes(instruction.id)) {
      user.dislikes = user.dislikes.pull({ _id: instruction.id })
      instruction.score = instruction.score + 1
    }

    user.likes = user.likes.concat(instruction.id)
    instruction.score = instruction.score + 1
    await instruction.save()
    await user.save()
    res.status(STATUS_CODES.CREATED).json(instruction)
  } catch (error) {
    next(error)
  }
})

userRouter.put('/likes/:id', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req, res)

    const instruction = await Instruction.findById(req.params.id)
    if (!instruction) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: 'No instruction' })
    }

    if (!user.likes.includes(instruction.id)) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: 'Instruction not in users likes' })
    }

    user.likes = user.likes.pull({ _id: instruction.id })
    instruction.score = instruction.score - 1
    await instruction.save()
    await user.save()
    res.status(STATUS_CODES.CREATED).json(instruction)
  } catch (error) {
    next(error)
  }
})

userRouter.get('/likes/', async (req, res, next) => {
  try {
    let user
    try {
      user = await authUtils.authenticateRequestReturnUser(req)
    } catch (e) {
      res.setHeader('WWW-Authenticate', 'Bearer')
      return res.status(STATUS_CODES.UNAUTHORIZED).json({ error: e.message })
    }

    return res.status(STATUS_CODES.CREATED).json(user.likes)
  } catch (error) {
    next(error)
  }
})

userRouter.post('/dislikes/:id/', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)

    const instruction = await Instruction.findById(req.params.id)
    if (!instruction) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: 'No instruction' })
    }

    if (user.dislikes.includes(instruction.id)) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: 'Instruction already in users dislikes' })
    }

    if (user.likes.includes(instruction.id)) {
      user.likes = user.likes.pull({ _id: instruction.id })
      instruction.score = instruction.score - 1
    }

    user.dislikes = user.dislikes.concat(instruction.id)
    instruction.score = instruction.score - 1
    await instruction.save()
    await user.save()
    res.status(STATUS_CODES.CREATED).json(instruction)
  } catch (error) {
    next(error)
  }
})

userRouter.put('/dislikes/:id', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)

    const instruction = await Instruction.findById(req.params.id)
    if (!instruction) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: 'No instruction' })
    }

    if (!user.dislikes.includes(instruction.id)) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: 'Instruction not in users dislikes' })
    }

    user.dislikes = user.dislikes.pull({ _id: instruction.id })
    instruction.score = instruction.score + 1
    await instruction.save()
    await user.save()
    res.status(STATUS_CODES.CREATED).json(instruction)
  } catch (error) {
    next(error)
  }
})

userRouter.get('/dislikes/', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)

    return res.status(STATUS_CODES.CREATED).json(user.dislikes)
  } catch (error) {
    next(error)
  }
})

userRouter.post('/products/:id/', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)

    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: 'No product' })
    }

    if (product.users.indexOf(user.id) > -1) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: 'Product already in users favourites' })
    }

    product.users = product.users.concat(user.id)
    user.products = user.products.concat(product.id)
    await product.save()
    await user.save()
    res.status(STATUS_CODES.CREATED).json(product)
  } catch (error) {
    next(error)
  }
})

userRouter.put('/products/:id', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)

    const product = await Product.findByIdAndUpdate(req.params.id)
    if (!product) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: 'No product' })
    }

    if (product.users.indexOf(user.id) === -1) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: 'Product not in users favourites' })
    }

    product.users = product.users.pull({ _id: user.id })
    user.products = user.products.pull({ _id: product.id })
    await product.save()
    await user.save()
    res.status(STATUS_CODES.CREATED).json(product)
  } catch (error) {
    next(error)
  }
})


module.exports = userRouter
