const productRouter = require('express').Router()
const Product = require('../models/product')
const Instruction = require('../models/instruction')
const authUtils = require('../utils/auth')
const STATUS_CODES = require('http-status')
const { ParameterValidationException, buildValidationErrorObjectFromMongooseValidationError, ResourceNotFoundException } = require('../error/exceptions')

productRouter.get('/', async (req, res, next) => {
  try {
    const products = await Product.find({}).populate('instructions', {
      score: 1,
      information: 1,
      user: 1
    })

    products.forEach(p => p.instructions.sort((a, b) => b.score - a.score))
    res.json(products.map((product) => product.toJSON()))
  } catch (error) {
    next(error)
  }
})

productRouter.get('/user', async (req, res, next) => {
  try {
    const favorites = await Product.find({ users: req.query.id }).populate('instructions', {
      score: 1,
      information: 1,
      user: 1
    })
    favorites.forEach(p => p.instructions.sort((a, b) => b.score - a.score))
    res.json(favorites.map((favorite) => favorite.toJSON()))
  } catch (error) {
    next(error)
  }
})

productRouter.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('instructions', {
      score: 1,
      information: 1,
      user: 1
    })
    if (!product) {
      throw ResourceNotFoundException('Tuotetta ID:llä: ' + req.params.id + ' ei löytynyt!')
    }

    product.instructions.sort((a, b) => b.score - a.score)
    res.json(product)

  } catch (error) {
    next(error)
  }
})

productRouter.post('/', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)

    const body = req.body
    try {
      const product = new Product({
        name: body.name,
        user: user.id,
      })
      const result = await product.save()
      return res.status(STATUS_CODES.CREATED).json(result)
    } catch (error) {
      // return res.status(STATUS_CODES.BAD_REQUEST).
      //   json({ error: 'product name required' })
      let validationErrorObject = buildValidationErrorObjectFromMongooseValidationError(error)
      throw new ParameterValidationException('Tuotteen nimi vaaditaan!', validationErrorObject)
    }
  } catch (error) {
    next(error)
  }
})

productRouter.post('/:id/instructions', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)

    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({ error: 'No product' })
    }
    const instruction = new Instruction(req.body)
    instruction.product = product.id
    instruction.user = user.id
    const result = await instruction.save()
    product.instructions = product.instructions.concat(result)
    await product.save()
    res.status(STATUS_CODES.CREATED).json(result)
  } catch (error) {
    next(error)
  }
})

productRouter.delete('/:productId/instructions/:instructionId', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)

    let product    //haetaan tuote, johon ohje liittyy
    try {
      product = await Product.findById(req.params.productId)
    } catch (e) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({ error: e.message })
    }

    let instruction   //haetaan ohje
    try {
      instruction = await Instruction.findById(req.params.instructionId)
    } catch (e) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: e.message })
    }

    //verrataan, vastaako pyynnön tehnyt käyttäjä ohjeen lisännyttä käyttäjää
    if (instruction.user.toString() !== user.id.toString()) {
      return res.status(STATUS_CODES.FORBIDDEN).json({ error: 'unauthorized'})
    }

    //poistetaan ohje tietokannasta
    product.instructions = product.instructions.pull({ _id: instruction.id })
    await product.save()
    res.status(STATUS_CODES.CREATED).json(product)
  } catch (error) {
    next(error)
  }
})

/** 
 * Tuotteen poistaminen. 
 * Etsii tietokannasta id:tä vastaavan tuotteen ja poistaa sen.
 * Vain tuotteen lisännyt käyttäjä voi poistaa tuotteen.
 */
productRouter.delete('/:id', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)

    let product   // haetaan poistettava tuote
    try {
      product = await Product.findById(req.params.id).exec()
    } catch (error) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({ error: error.message })
    }

    // verrataan pyynnön tehnyttä käyttäjää tuotteen lisänneeseen käyttäjään
    if (product.user.toString() !== user.id.toString()) {
      return res.status(STATUS_CODES.FORBIDDEN).json({ error: 'unauthorized' })
    }

    // poistetaan tuote tietokannasta
    try {
      await Product.findByIdAndDelete({ _id: req.params.id }).exec()
      res.status(STATUS_CODES.OK).json()
    } catch (error) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: error.message })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = productRouter
