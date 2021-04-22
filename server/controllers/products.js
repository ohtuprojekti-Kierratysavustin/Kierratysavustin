const productRouter = require('express').Router()
const Product = require('../models/product')
const Instruction = require('../models/instruction')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

productRouter.get('/', async (req, res) => {
  const products = await Product.find({}).populate('instructions', {
    score: 1,
    information: 1
  })

  products.forEach(p => p.instructions.sort((a,b) => b.score - a.score))
  res.json(products.map((product) => product.toJSON()))

})

productRouter.get('/user', async (req, res) => {
  const favorites = await Product.find( { users: req.query.id }).populate('instructions', {
    information:1
  })
  console.log('favos',favorites)
  res.json(favorites.map((product) => product.toJSON()))
})

productRouter.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('instructions', {
      score: 1,
      information: 1
    })
    product.instructions.sort((a,b) => b.score - a.score)
    res.json(product)
    
  } catch (error) {
    return res.status(400).json({ error: 'no product found' })  
  }
  
  
})

const getTokenFrom = (req) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

productRouter.post('/', async (req, res) => {
  const body = req.body
  const token = getTokenFrom(req)
  if (!token) {
    return res.status(401).json({ error: 'token missing' })
  }

  const decodedToken = jwt.verify(token, config.SECRET)
  if (!decodedToken) {
    return res.status(401).json({ error: 'invalid token' })
  }
  try {
    const product = new Product({
      name: body.name,
    })
    const result = await product.save()
    return res.status(201).json(result)
  } catch (error) {
    return res.status(400).
      json({ error: 'product name required' })
  }
})

productRouter.post('/:id/instructions', async (req, res) => {
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
    return res.status(401).json({ error: 'No product' })
  }
  const instruction = new Instruction(req.body)
  instruction.product = product.id
  const result = await instruction.save()
  product.instructions = product.instructions.concat(result)
  await product.save()
  res.status(201).json(result)
})

module.exports = productRouter
