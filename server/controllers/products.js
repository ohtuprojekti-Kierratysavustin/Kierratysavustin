const productRouter = require('express').Router()
const Product = require('../models/product')
const Instruction = require('../models/instruction')
const User = require('../models/user')
const authUtils = require('../utils/auth')
const STATUS_CODES = require('http-status')
const { ResourceNotFoundException, restructureCastAndValidationErrorsFromMongoose, UnauthorizedException, DuplicateResourceException } = require('../error/exceptions')

productRouter.get('/', async (req, res, next) => {
  try {
    const products = await Product.find({}).populate({
      path: 'instructions'
    }).exec()

    products.forEach(p => p.instructions.sort((a, b) => b.score - a.score))
    res.status(STATUS_CODES.OK).json(products.map((product) => product.toJSON()))
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    // To the errorhandler in app.js
    next(handledError)
  }
})

productRouter.get('/favorites', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)
    user = await User.findById(user.id).populate({
      path: 'favoriteProducts',
      populate: {
        path: 'instructions'
      }
    }).exec()

    user.favoriteProducts.forEach(p => p.instructions.sort((a, b) => b.score - a.score))

    res.status(STATUS_CODES.OK).json(user.favoriteProducts.map((favorite) => favorite.toJSON()))
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
      creator: 1
    })
    if (!product) {
      throw new ResourceNotFoundException('Tuotetta ID:llä: ' + req.params.id + ' ei löytynyt!')
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
      creator: user.id,
    })
    const result = await product.save()
    result.instructions = [] // virtual field, not in model
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
      // Get existing instruction with same text content if exists
      .populate({
        path: 'instructions',
        match: { information: { $eq: req.body.information } }
      })
    if (!product) {
      throw new ResourceNotFoundException('Tuotetta ID:llä: ' + req.params.id + ' ei löytynyt!')
    }

    if (product.instructions.length != 0) {
      throw new DuplicateResourceException('Saman niminen ohje on jo olemassa!')
    }

    const instruction = new Instruction(req.body)
    instruction.product = product.id
    instruction.creator = user.id
    const result = await instruction.save()
    res.status(STATUS_CODES.CREATED).json({ message: 'Ohje luotu onnistuneesti!', resource: result })
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
    if (instruction.creator.toString() !== user.id.toString()) {
      throw new UnauthorizedException('Vain ohjeen luoja voi poistaa ohjeen!')
    }

    let deletedInstructionText = instruction.information

    await Instruction.findByIdAndDelete(instruction.id)

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
 * 
 * //TODO Tuotteen viittausten poistaminen?
 */
productRouter.delete('/:id', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)

    let product = await Product.findById(req.params.id).exec()
    if (!product) {
      throw new ResourceNotFoundException('Tuotetta ID:llä: ' + req.query.productID + ' ei löytynyt!')
    }

    // verrataan pyynnön tehnyttä käyttäjää tuotteen lisänneeseen käyttäjään
    if (product.creator.toString() !== user.id.toString()) {
      throw new UnauthorizedException('Vain tuotteen luoja voi poistaa ohjeen!')
    }
    let deletedProductName = product.name
    // poistetaan tuote tietokannasta
    await Product.findByIdAndDelete({ _id: req.params.id }).exec()
    res.status(STATUS_CODES.OK).json({ message: 'Tuote \'' + deletedProductName + '\' poistettiin onnistuneesti!' })
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    // To the errorhandler in app.js
    next(handledError)
  }
})

module.exports = productRouter
