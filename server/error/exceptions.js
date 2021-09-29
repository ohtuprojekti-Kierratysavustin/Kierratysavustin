// Send these errors in case of operational errors. e.g. invalid input, timeout etc.

// All errors should have default values such that the error can be thrown
// without parameters and this still gives the user a clear error-message.

const { KierratysavustinError } = require('./errorBase')
const STATUS_CODES = require('http-status')


// Authorization
////////////////////////////////////////////////////////////////////////////////////
/**
 * 
 * @param {*} message 
 * @param {*} httpStatusCode 
 * @param {*} additionalResponseHeaders 
 * @class
 * @augments KierratysavustinError
 */
function TokenMissingException(message, httpStatusCode, additionalResponseHeaders) {
  KierratysavustinError.call(this, message, httpStatusCode, additionalResponseHeaders)
}

TokenMissingException.prototype = Object.create(KierratysavustinError.prototype)
TokenMissingException.prototype.name = 'TokenMissingException'
TokenMissingException.prototype.constructor = KierratysavustinError
TokenMissingException.prototype.defaultMessage = 'Token puuttuu!'
TokenMissingException.prototype.isOperationalError = true
TokenMissingException.prototype.defaultHttpStatusCode = STATUS_CODES.UNAUTHORIZED

/**
 * 
 * @param {*} message 
 * @param {*} httpStatusCode 
 * @param {*} additionalResponseHeaders 
 * @class
 * @augments KierratysavustinError
 */
function InvalidTokenException(message, httpStatusCode, additionalResponseHeaders) {
  KierratysavustinError.call(this, message, httpStatusCode, additionalResponseHeaders)
}

InvalidTokenException.prototype = Object.create(KierratysavustinError.prototype)
InvalidTokenException.prototype.name = 'InvalidTokenException'
InvalidTokenException.prototype.constructor = InvalidTokenException
InvalidTokenException.prototype.defaultMessage = 'Virheellinen token!'
InvalidTokenException.prototype.isOperationalError = true
InvalidTokenException.prototype.defaultHttpStatusCode = STATUS_CODES.UNAUTHORIZED

/**
 * Use only with authorization
 * @param {*} message 
 * @param {*} httpStatusCode 
 * @param {*} additionalResponseHeaders 
 * @class
 * @augments KierratysavustinError
 */
function NoUserFoundException(message, httpStatusCode, additionalResponseHeaders) {
  KierratysavustinError.call(this, message, httpStatusCode, additionalResponseHeaders)
}

NoUserFoundException.prototype = Object.create(KierratysavustinError.prototype)
NoUserFoundException.prototype.name = 'NoUserFoundException'
NoUserFoundException.prototype.constructor = NoUserFoundException
NoUserFoundException.prototype.defaultMessage = 'Käyttäjää ei löydy!'
NoUserFoundException.prototype.isOperationalError = true
NoUserFoundException.prototype.defaultHttpStatusCode = STATUS_CODES.UNAUTHORIZED


/**
 * Error for if a resource is not found.
 * @example 
 * const product = await Product.findById(body.productID)
    if (!product) {
      throw new ResourceNotFoundException('Tuotetta ID:llä: ' + body.productID + ' ei löytynyt!')
    }
 * @param {*} message - Should be augmented according to the resource 
 * @param {*} httpStatusCode 
 * @class
 * @augments KierratysavustinError
 */
function ResourceNotFoundException(message, httpStatusCode) {
  KierratysavustinError.call(this, message, httpStatusCode)
}

ResourceNotFoundException.prototype = Object.create(KierratysavustinError.prototype)
ResourceNotFoundException.prototype.name = 'ResourceNotFoundException'
ResourceNotFoundException.prototype.constructor = ResourceNotFoundException
ResourceNotFoundException.prototype.defaultMessage = 'Resurssia ei löydy!'
ResourceNotFoundException.prototype.isOperationalError = true
ResourceNotFoundException.prototype.defaultHttpStatusCode = STATUS_CODES.NOT_FOUND

/**
 * To send structured data to a validation exception
 * @param {*} parameter - Name of the invalid parameter
 * @param {*} validationType - Type of the validation error
 * @param {*} message - Errormessage
 * @param {*} givenValue 
 * @param {*} expectedValue 
 * @param {*} givenType 
 * @param {*} expectedType 
 */
function ValidationErrorObject(parameter, validationType, message, givenValue, expectedValue, givenType, expectedType) {
  this.parameter = parameter
  this.validationType = validationType
  this.message = message
  this.givenValue = givenValue
  this.expectedValue = expectedValue
  this.givenType = givenType
  this.expectedType = expectedType
}

ValidationErrorObject.prototype = Object.create(null)
ValidationErrorObject.prototype.name = 'ValidationErrorObject'
ValidationErrorObject.prototype.constructor = ValidationErrorObject

/**
 * 
 * @param {Error} error - Error from mongoose 
 * @returns a new ValidationErrorObject filled with information from the mongoose error
 */
function buildValidationErrorObjectFromMongooseValidationError(error) {
  let selectedErrorField
  let selectedError
  if (error.name === 'CastError') {
    selectedErrorField = error.path
    selectedError = error
  } else if (error.name === 'ValidationError') {
    selectedErrorField = Object.keys(error.errors)[0]
    selectedError = error.errors[selectedErrorField]
    if (!selectedError) {
      throw error
    } 
  } else {
    throw error
  }

  return new ValidationErrorObject(
    selectedErrorField,
    selectedError.name,
    selectedError.message,
    selectedError.value,
    null,
    selectedError.valueType,
    selectedError.kind
  )
}

/**
 * @classdesc Class for different kinds of validationerrors.
 * @param {string} message  - The errormessage, defaults if not given
 * @param {*} validationErrorObject - Object with more specific information about the validation error 
 * @param {number} httpStatusCode - HTTP status code as integer, defaults if not given
 * @class
 * @augments KierratysavustinError
 */
function ParameterValidationException(message, validationErrorObject, httpStatusCode) {
  if (validationErrorObject && validationErrorObject.name !== 'ValidationErrorObject') {
    throw new KierratysavustinError('ParameterValidationException object should take in a ValidationErrorObject. Given object of name: "' + validationErrorObject.name + '"')
  }
  KierratysavustinError.call(this, message, httpStatusCode)
  this.validationErrorObject = validationErrorObject
}

ParameterValidationException.prototype = Object.create(KierratysavustinError.prototype)
ParameterValidationException.prototype.name = 'ParameterValidationException'
ParameterValidationException.prototype.constructor = ParameterValidationException
ParameterValidationException.prototype.defaultMessage = 'Parametrin validointi epäonnistui!' // Good to give a more precise message when thrown
ParameterValidationException.prototype.isOperationalError = true
ParameterValidationException.prototype.defaultHttpStatusCode = STATUS_CODES.BAD_REQUEST
ParameterValidationException.prototype.toUserFriendlyObject = function () {
  return {
    error: this.name,
    validationErrorObject: this.validationErrorObject,
    message: this.message,
  }
}


module.exports = { TokenMissingException, InvalidTokenException, NoUserFoundException, ResourceNotFoundException, ParameterValidationException, ValidationErrorObject, buildValidationErrorObjectFromMongooseValidationError }