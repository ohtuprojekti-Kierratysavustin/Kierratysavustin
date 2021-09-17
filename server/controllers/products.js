const productRouter = require('express').Router()
const Product = require('../models/product')
const Instruction = require('../models/instruction')
const authUtils = require('../utils/auth');
const user = require('../models/user');

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
  let user
  try {
    user = await authUtils.authenticateRequestReturnUser(req);
  } catch (e) {
    return res.status(401).json({ error: e.message })
  }

  const body = req.body
  try {
    const product = new Product({
      name: body.name,
      user: user.id,
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

/** 
 * Tuotteen poistaminen. 
 * Etsii tietokannasta id:tä vastaavan tuotteen ja poistaa sen.
 * Vain tuotteen lisännyt käyttäjä voi poistaa tuotteen.
 */
productRouter.delete('/:id', async (req, res) => {
  let user    // haetaan tuote
  try {
    user = await authUtils.authenticateRequestReturnUser(req);
  } catch (e) {
    return res.status(401).json({ error: e.message })
  }

  let product   // haetaan pyynnön tehnyt käyttäjä
  try {
    product = await Product.findById(req.params.id).exec()
  } catch (error) {
    return res.status(401).json({ error: error.message })
  }

  // verrataan pyynnön tehnyttä käyttäjää tuotteen lisänneeseen käyttäjään
  if (product.user.toString() !== user.id.toString()) {
    return res.status(403).json({ error: 'unauthorized' })
  }

  // poistetaan tuote tietokannasta
  try {
    await Product.findByIdAndDelete({ _id: req.params.id }).exec()
    res.status(200).json()
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

module.exports = productRouter
