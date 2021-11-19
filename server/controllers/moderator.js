const moderatorRouter = require('express').Router()
const Product = require('../models/product')
const Instruction = require('../models/instruction')
const authUtils = require('../utils/auth')
const STATUS_CODES = require('http-status')
const { restructureCastAndValidationErrorsFromMongoose, ResourceNotFoundException } = require('../error/exceptions')
const { USER_ROLES } = require('../enum/roles')


/**
 * Poistaa minkä tahansa tuotteeseen liittyvän ohjeen
 */
moderatorRouter.delete('/products/:productId/instructions/:instructionId', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)
    authUtils.authorizeUser(user, USER_ROLES.Moderator)

    let product = await Product.findById(req.params.productId)

    if (!product) {
      throw new ResourceNotFoundException('Tuotetta ID:llä: ' + req.params.productId + ' ei löytynyt!')
    }

    let instruction = await Instruction.findById(req.params.instructionId)

    if (!instruction) {
      throw new ResourceNotFoundException('Ohjetta ID:llä: ' + req.params.instructionId + ' ei löytynyt!')
    }

    let deletedInstructionText = instruction.information

    await Instruction.findByIdAndDelete(instruction.id)

    res.status(STATUS_CODES.OK)
      .json(
        {
          message: 'Ohje \'' + deletedInstructionText + '\' poistettiin onnistuneesti tuotteelta: \'' + product.name +  '\'!',
          resource: product
        }
      )
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    // To the errorhandler in app.js
    next(handledError)
  }
})


module.exports = moderatorRouter
