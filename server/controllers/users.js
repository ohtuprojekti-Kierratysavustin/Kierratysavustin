const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')
const Product = require('../models/product')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const Instruction = require('../models/instruction')

userRouter.post('/', async (req, res) => {
  try {
    const body = req.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    const user = new User({
      username: body.username,
      passwordHash,
    })
    const savedUser = await user.save()
    res.json(savedUser)
  } catch (error) {
    return res.status(400).send('already in use')
  }
})

const getTokenFrom = (req) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

userRouter.post('/likes/:id/', async (req, res) => {
  const token = getTokenFrom(req)
  if (!token) {
    return res.status(401).json({ error: 'token missing' })
  }

  const decodedToken = jwt.verify(token, config.SECRET)
  if (!decodedToken) {
    return res.status(401).json({ error: 'invalid token' })
  }

  const instruction = await Instruction.findById(req.params.id)
  if (!instruction) {
    return res.status(400).json({ error: 'No instruction' })
  }

  const user = await User.findById(decodedToken.id)
  if (!user) {
    return res.status(400).json({ error: 'No user' })
  }

  if (user.likes.includes(instruction.id)) {
    return res.status(400).json({ error: 'Instruction already in users likes' })
  }

  if (user.dislikes.includes(instruction.id)) {
    user.dislikes = user.dislikes.pull({ _id: instruction.id })
    instruction.score = instruction.score + 1
  }

  user.likes = user.likes.concat(instruction.id)
  instruction.score = instruction.score + 1
  await instruction.save()
  await user.save()
  res.status(201).json(instruction)
})

userRouter.put('/likes/:id', async (req, res) => {
  const token = getTokenFrom(req)
  if (!token) {
    return res.status(401).json({ error: 'token missing' })
  }

  const decodedToken = jwt.verify(token, config.SECRET)
  if (!decodedToken) {
    return res.status(401).json({ error: 'invalid token' })
  }

  const instruction = await Instruction.findById(req.params.id)
  if (!instruction) {
    return res.status(400).json({ error: 'No instruction' })
  }

  const user = await User.findById(decodedToken.id)
  if (!user) {
    return res.status(400).json({ error: 'No user' })
  }

  if (!user.likes.includes(instruction.id)) {
    return res.status(400).json({ error: 'Instruction not in users likes' })
  }

  user.likes = user.likes.pull({ _id: instruction.id })
  instruction.score = instruction.score - 1
  await instruction.save()
  await user.save()
  res.status(201).json(instruction)
})

userRouter.get('/likes/', async (req, res) => {
  const token = getTokenFrom(req)
  if (!token) {
    return res.status(401).json({ error: 'token missing' })
  }

  const decodedToken = jwt.verify(token, config.SECRET)
  if (!decodedToken) {
    return res.status(401).json({ error: 'invalid token' })
  }

  const user = await User.findById(decodedToken.id)
  if (!user) {
    return res.status(400).json({ error: 'No user' })
  }
  return res.status(201).json(user.likes)
})

userRouter.post('/dislikes/:id/', async (req, res) => {
  const token = getTokenFrom(req)
  if (!token) {
    return res.status(401).json({ error: 'token missing' })
  }

  const decodedToken = jwt.verify(token, config.SECRET)
  if (!decodedToken) {
    return res.status(401).json({ error: 'invalid token' })
  }

  const instruction = await Instruction.findById(req.params.id)
  if (!instruction) {
    return res.status(400).json({ error: 'No instruction' })
  }

  const user = await User.findById(decodedToken.id)
  if (!user) {
    return res.status(400).json({ error: 'No user' })
  }

  if (user.dislikes.includes(instruction.id)) {
    return res.status(400).json({ error: 'Instruction already in users dislikes' })
  }

  if (user.likes.includes(instruction.id)) {
    user.likes = user.likes.pull({ _id: instruction.id })
    instruction.score = instruction.score - 1
  }

  user.dislikes = user.dislikes.concat(instruction.id)
  instruction.score = instruction.score - 1
  await instruction.save()
  await user.save()
  res.status(201).json(instruction)
})

userRouter.put('/dislikes/:id', async (req, res) => {
  const token = getTokenFrom(req)
  if (!token) {
    return res.status(401).json({ error: 'token missing' })
  }

  const decodedToken = jwt.verify(token, config.SECRET)
  if (!decodedToken) {
    return res.status(401).json({ error: 'invalid token' })
  }

  const instruction = await Instruction.findById(req.params.id)
  if (!instruction) {
    return res.status(400).json({ error: 'No instruction' })
  }

  const user = await User.findById(decodedToken.id)
  if (!user) {
    return res.status(400).json({ error: 'No user' })
  }

  if (!user.dislikes.includes(instruction.id)) {
    return res.status(400).json({ error: 'Instruction not in users dislikes' })
  }

  user.dislikes = user.dislikes.pull({ _id: instruction.id })
  instruction.score = instruction.score + 1
  await instruction.save()
  await user.save()
  res.status(201).json(instruction)
})

userRouter.get('/dislikes/', async (req, res) => {
  const token = getTokenFrom(req)
  if (!token) {
    return res.status(401).json({ error: 'token missing' })
  }

  const decodedToken = jwt.verify(token, config.SECRET)
  if (!decodedToken) {
    return res.status(401).json({ error: 'invalid token' })
  }

  const user = await User.findById(decodedToken.id)
  if (!user) {
    return res.status(400).json({ error: 'No user' })
  }
  return res.status(201).json(user.dislikes)
})

userRouter.post('/products/:id/', async (req, res) => {
  const token = getTokenFrom(req)
  if (!token) {
    return res.status(401).json({ error: 'token missing' })
  }

  const decodedToken = jwt.verify(token, config.SECRET)
  if (!decodedToken) {
    return res.status(401).json({ error: 'invalid token' })
  }

  const product = await Product.findById(req.params.id)
  if (!product) {
    return res.status(400).json({ error: 'No product' })
  }

  const user = await User.findById(decodedToken.id)
  if (!user) {
    return res.status(400).json({ error: 'No user' })
  }

  if (product.users.indexOf(user.id) > -1) {
    return res.status(400).json({ error: 'Product already in users favourites' })
  }

  product.users = product.users.concat(user.id)
  user.products = user.products.concat(product.id)
  await product.save()
  await user.save()
  res.status(201).json(product)
})

userRouter.put('/products/:id', async (req, res) => {
  const token = getTokenFrom(req)
  if (!token) {
    return res.status(401).json({ error: 'token missing' })
  }

  const decodedToken = jwt.verify(token, config.SECRET)
  if (!decodedToken) {
    return res.status(401).json({ error: 'invalid token' })
  }

  const product = await Product.findByIdAndUpdate(req.params.id)
  if (!product) {
    return res.status(400).json({ error: 'No product' })
  }

  const user = await User.findById(decodedToken.id)
  if (!user) {
    return res.status(400).json({ error: 'No user' })
  }

  if (product.users.indexOf(user.id) === -1) {
    return res.status(400).json({ error: 'Product not in users favourites' })
  }

  product.users = product.users.pull({ _id: user.id })
  user.products = user.products.pull({ _id: product.id })
  await product.save()
  await user.save()
  res.status(201).json(product)
  
})


module.exports = userRouter
