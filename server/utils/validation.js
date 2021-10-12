const { ValidationException, ValidationErrorObject } = require('../error/exceptions')

const VALIDATOR_ERROR = 'ValidatorError'
const CAST_ERROR = 'CastError'
// Custom validators to be defined here

/**
 * 
 * @param {*} value to cast
 * @param {String} errorMessage, use {value} to replace in message with value
 * @param {String} paramName, name of the invalid parameter
 * @returns {Integer} value cast to integer
 * @throws {ValidationException} if casting not possible
 */
function tryCastToInteger(value, errorMessage, paramName) {
  if (Number.isInteger(Number.parseFloat(value))) {
    return (Number.parseInt(value))
  } else {
    errorMessage = (errorMessage ? errorMessage.replace('{value}', '\'' + value + '\'') : 'Parametrin on oltava kokonaisluku!')
    throw new ValidationException(
      errorMessage,
      new ValidationErrorObject(
        paramName,
        ValidationException.name,
        errorMessage,
        value,
        null,
        typeof value,
        'Integer'
      )
    )
  }
}

module.exports = { VALIDATOR_ERROR, CAST_ERROR, tryCastToInteger }