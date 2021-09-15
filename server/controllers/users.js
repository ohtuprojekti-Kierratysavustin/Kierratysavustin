const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')
const Product = require('../models/product')
const Instruction = require('../models/instruction')

const authUtils = require('../utils/auth');
const NoUserFoundException = authUtils.NoUserFoundException;

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

userRouter.post('/likes/:id/', async (req, res) => {
  let user;
  try {
    user = await authUtils.authenticateRequestReturnUser(req);
  } catch (e) {
    if (e instanceof NoUserFoundException) {
      return res.status(400).json({ error: e.message })
    } else {
      return res.status(401).json({ error: e.message })
    }
  }

  const instruction = await Instruction.findById(req.params.id)
  if (!instruction) {
    return res.status(400).json({ error: 'No instruction' })
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
  let user;
  try {
    user = await authUtils.authenticateRequestReturnUser(req, res);
  } catch (e) {
    if (e instanceof NoUserFoundException) {
      return res.status(400).json({ error: e.message })
    } else {
      return res.status(401).json({ error: e.message })
    }
  }

  const instruction = await Instruction.findById(req.params.id)
  if (!instruction) {
    return res.status(400).json({ error: 'No instruction' })
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
  let user;
  try {
    user = await authUtils.authenticateRequestReturnUser(req);
  } catch (e) {
    if (e instanceof NoUserFoundException) {
      return res.status(400).json({ error: e.message })
    } else {
      return res.status(401).json({ error: e.message })
    }
  }

  return res.status(201).json(user.likes)
})

userRouter.post('/dislikes/:id/', async (req, res) => {
  let user;
  try {
    user = await authUtils.authenticateRequestReturnUser(req);
  } catch (e) {
    if (e instanceof NoUserFoundException) {
      return res.status(400).json({ error: e.message })
    } else {
      return res.status(401).json({ error: e.message })
    }
  }

  const instruction = await Instruction.findById(req.params.id)
  if (!instruction) {
    return res.status(400).json({ error: 'No instruction' })
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
  let user;
  try {
    user = await authUtils.authenticateRequestReturnUser(req);
  } catch (e) {
    if (e instanceof NoUserFoundException) {
      return res.status(400).json({ error: e.message })
    } else {
      return res.status(401).json({ error: e.message })
    }
  }

  const instruction = await Instruction.findById(req.params.id)
  if (!instruction) {
    return res.status(400).json({ error: 'No instruction' })
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
  let user;
  try {
    user = await authUtils.authenticateRequestReturnUser(req);
  } catch (e) {
    if (e instanceof NoUserFoundException) {
      return res.status(400).json({ error: e.message })
    } else {
      return res.status(401).json({ error: e.message })
    }
  }

  return res.status(201).json(user.dislikes)
})

userRouter.post('/products/:id/', async (req, res) => {
  let user;
  try {
    user = await authUtils.authenticateRequestReturnUser(req);
  } catch (e) {
    if (e instanceof NoUserFoundException) {
      return res.status(400).json({ error: e.message })
    } else {
      return res.status(401).json({ error: e.message })
    }
  }

  const product = await Product.findById(req.params.id)
  if (!product) {
    return res.status(400).json({ error: 'No product' })
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
  let user;
  try {
    user = await authUtils.authenticateRequestReturnUser(req);
  } catch (e) {
    if (e instanceof NoUserFoundException) {
      return res.status(400).json({ error: e.message })
    } else {
      return res.status(401).json({ error: e.message })
    }
  }

  const product = await Product.findByIdAndUpdate(req.params.id)
  if (!product) {
    return res.status(400).json({ error: 'No product' })
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
