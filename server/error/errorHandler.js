const { KierratysavustinError } = require('./errorBase')

/**
 * Error handler for development environment.
 * Will pass all non-operational errors to the default handler,
 * which sends the error to the client with trace.
 * @param {*} err 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const devErrorHandler = function (err, req, res, next) {
  if (err.isOperationalError) {
    if (err.additionalResponseHeaders) {
      // Adding the additional headers to the response. Headers set when throwing exception.
      for (let obj of err.additionalResponseHeaders) {
        res.setHeader(obj.header, obj.value)
      }
    }
    return res.status(err.httpStatusCode).json(err.toUserFriendlyObject())
  } else {
    next(err) // To express default errorhandler, which throws the error at the dev
  }
}

/**
 * Error handler for production environment.
 * Will always send clean error to client.
 * @param {*} err 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const productionErrorHandler = function (err, req, res, next) {
  if (err.isOperationalError) {
    if (err.additionalResponseHeaders) {
      for (let obj in err.additionalResponseHeaders) {
        res.setHeader(obj.header, obj.value)
      }
    }
    return res.status(err.httpStatusCode).json(err.toUserFriendlyObject())
  } else {

    // TODO Log error stack trace somewhere

    err = new KierratysavustinError()
    if (res.headersSent) {
      return res.json(err.toUserFriendlyObject())
    }
    res.status(err.httpStatusCode).json(err.toUserFriendlyObject())
  }
}

module.exports = {devErrorHandler, productionErrorHandler}