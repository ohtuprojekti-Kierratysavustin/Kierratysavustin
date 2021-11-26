const credentialRouter = require('express').Router()
const config = require('../utils/config')
const { ResourceNotFoundException } = require('../error/exceptions')
const STATUS_CODES = require('http-status')

credentialRouter.get('/', async (req, res, next) => {
  try {
    const service = req.query.service
    if (service == 'KInfo') {
      res.status(STATUS_CODES.OK).json({ KIApikey: config.KIERRATYS_INFO_API_KEY })
    }
    res.status(STATUS_CODES.NOT_FOUND)
  } catch (error) {
    let handledError = ResourceNotFoundException(error)
    // To the errorhandler in app.js
    next(handledError)
  }
})
  
module.exports = credentialRouter
  