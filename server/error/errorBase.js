// Send to the user only when there is an programmer error e.g. a bug
// Base for other exceptions
// Check out errorHandler

const STATUS_CODES = require('http-status')

/**
 * 
 * @param {string} message  - The errormessage, defaults if not given
 * @param {number} httpStatusCode - HTTP status code as integer, defaults if not given
 * @param {[{ header: "HEADER", value: "VALUE" }]} additionalResponseHeaders - Array of additional headers to add to the response
 */
function KierratysavustinError(message, httpStatusCode, additionalResponseHeaders) {
  if (message) {
    this.message = message
  } else {
    this.message = this.defaultMessage
  }

  if (httpStatusCode) {
    this.httpStatusCode = httpStatusCode
  } else {
    this.httpStatusCode = this.defaultHttpStatusCode
  }

  if (additionalResponseHeaders) {
    this.additionalResponseHeaders = additionalResponseHeaders
  }

  // Use V8's native method if available, otherwise fallback
  if ('captureStackTrace' in Error)
    Error.captureStackTrace(this, KierratysavustinError)
  else
    this.stack = (new Error()).stack
}
  
KierratysavustinError.prototype = Object.create(Error.prototype)
KierratysavustinError.prototype.name = 'KierratysavustinError'
KierratysavustinError.prototype.constructor = KierratysavustinError
KierratysavustinError.prototype.defaultMessage = 'Tapahtui odottamaton virhe!'
KierratysavustinError.prototype.defaultHttpStatusCode = STATUS_CODES.INTERNAL_SERVER_ERROR
/**
 * 
 * @returns The error message in a user friendly object.
 */
KierratysavustinError.prototype.toUserFriendlyObject = function () {
  return { 
    error: this.name,
    message: this.message,
  }
}
KierratysavustinError.prototype.log = function () {
  //Voi logata stackin jonnekin, jos tulevaisuudessa tarvitsee. 
}

module.exports = { KierratysavustinError }