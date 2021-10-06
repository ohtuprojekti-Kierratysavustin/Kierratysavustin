const productRouter = require('express').Router()
const Product = require('../models/product')
const Instruction = require('../models/instruction')
const authUtils = require('../utils/auth')
const STATUS_CODES = require('http-status')
const { ResourceNotFoundException, restructureCastAndValidationErrorsFromMongoose, UnauthorizedException } = require('../error/exceptions')

productRouter.get('/', async (req, res, next) => {
  try {
    const products = await Product.find({}).populate('instructions', {
      score: 1,
      information: 1,
      user: 1
    })

    products.forEach(p => p.instructions.sort((a, b) => b.score - a.score))
    res.status(STATUS_CODES.OK).json(products.map((product) => product.toJSON()))
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    // To the errorhandler in app.js
    next(handledError)
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
    res.status(STATUS_CODES.OK).json(favorites.map((favorite) => favorite.toJSON()))
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    // To the errorhandler in app.js
    next(handledError)
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
    res.status(STATUS_CODES.OK).json(product)

  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    // To the errorhandler in app.js
    next(handledError)
  }
})

productRouter.post('/', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)

    const body = req.body
    const product = new Product({
      name: body.name,
      user: user.id,
    })
    const result = await product.save()
    return res.status(STATUS_CODES.CREATED).json({ message: 'Tuote luotu onnistuneesti!', resource: result })
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    // To the errorhandler in app.js
    next(handledError)
  }
})

productRouter.post('/:id/instructions', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)

    const product = await Product.findById(req.params.id)
    if (!product) {
      throw ResourceNotFoundException('Tuotetta ID:llä: ' + req.params.id + ' ei löytynyt!')
    }
    const instruction = new Instruction(req.body)
    instruction.product = product.id
    instruction.user = user.id
    const result = await instruction.save()
    product.instructions = product.instructions.concat(result)
    await product.save()
    res.status(STATUS_CODES.CREATED).json({ message: 'Ohje luotu onnistuneesti!', resource: result})
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    // To the errorhandler in app.js
    next(handledError)
  }
})

/**
 * Poistaa tuotteeseen liittyvän ohjeen
 */
productRouter.delete('/:productId/instructions/:instructionId', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)

    let product = await Product.findById(req.params.productId)

    let instruction = await Instruction.findById(req.params.instructionId)

    //verrataan, vastaako pyynnön tehnyt käyttäjä ohjeen lisännyttä käyttäjää
    if (instruction.user.toString() !== user.id.toString()) {
      throw new UnauthorizedException('Vain ohjeen luoja voi poistaa ohjeen!')
    }

    let deletedInstructionText = instruction.information
    //poistetaan ohje tietokannasta
    product.instructions = product.instructions.pull({ _id: instruction.id })
    await product.save()
    res.status(STATUS_CODES.OK)
      .json(
        {
          message: 'Ohje \'' + deletedInstructionText + '\' poistettiin onnistuneesti!',
          resource: product
        }
      )
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    // To the errorhandler in app.js
    next(handledError)
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

    let product = await Product.findById(req.params.id).exec()
    if (!product) {
      throw new ResourceNotFoundException('Tuotetta ID:llä: ' + req.query.productID + ' ei löytynyt!')
    }

    // verrataan pyynnön tehnyttä käyttäjää tuotteen lisänneeseen käyttäjään
    if (product.user.toString() !== user.id.toString()) {
      throw new UnauthorizedException('Vain tuotteen luoja voi poistaa ohjeen!')
    }
    let deletedProductName = product.name
    // poistetaan tuote tietokannasta
    await Product.findByIdAndDelete({ _id: req.params.id }).exec()
    res.status(STATUS_CODES.OK).json({message: 'Tuote \'' + deletedProductName + '\' poistettiin onnistuneesti!'})
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    // To the errorhandler in app.js
    next(handledError)
  }
})

module.exports = productRouter
