const productRouter = require('express').Router()
const Product = require('../models/product')
const Instruction = require('../models/instruction')
const authUtils = require('../utils/auth');

productRouter.get('/', async (req, res) => {
  const products = await Product.find({}).populate('instructions', {
    score: 1,
    information: 1
  })

  products.forEach(p => p.instructions.sort((a, b) => b.score - a.score))
  res.json(products.map((product) => product.toJSON()))

})

productRouter.get('/user', async (req, res) => {
  const favorites = await Product.find({ users: req.query.id }).populate('instructions', {
    score: 1,
    information: 1
  })
  favorites.forEach(p => p.instructions.sort((a, b) => b.score - a.score))
  res.json(favorites.map((favorite) => favorite.toJSON()))
})

productRouter.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('instructions', {
      score: 1,
      information: 1
    })
    product.instructions.sort((a, b) => b.score - a.score)
    res.json(product)

  } catch (error) {
    return res.status(400).json({ error: 'no product found' })
  }


})

productRouter.post('/', async (req, res) => {
  try {
    await authUtils.authenticateRequest(req);
  } catch (e) {
    res.setHeader("WWW-Authenticate", "Bearer")
    return res.status(401).json({ error: e.message })
  }

  const body = req.body
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
  try {
    await authUtils.authenticateRequest(req);
  } catch (e) {
    res.setHeader("WWW-Authenticate", "Bearer")
    return res.status(401).json({ error: e.message })
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
