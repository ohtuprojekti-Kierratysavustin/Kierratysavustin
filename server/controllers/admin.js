const adminRouter = require('express').Router()
const User = require('../models/user')
const authUtils = require('../utils/auth')
const STATUS_CODES = require('http-status')
const { restructureCastAndValidationErrorsFromMongoose } = require('../error/exceptions')
const { USER_ROLES } = require('../enum/roles')


adminRouter.get('/users/', async (req, res, next) => {
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)
    authUtils.authorizeUser(user, USER_ROLES.Admin)

    let users = await User.find().exec()

    return res.status(STATUS_CODES.OK).json(users.map((user) => user.toJSON()))
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    // To the errorhandler in app.js
    next(handledError)
  }
})

module.exports = adminRouter
