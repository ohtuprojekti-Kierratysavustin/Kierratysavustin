const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const config = require('../utils/config')
const STATUS_CODES = require('http-status')
const { NoUserFoundException, restructureCastAndValidationErrorsFromMongoose } = require('../error/exceptions')

loginRouter.post('/', async (req, res, next) => {
  try {
    const body = req.body
    const user = await User.findOne({ username: body.username }).exec()

    const correctPswrd = (user === null ? false : await bcrypt.compare(body.password, user.passwordHash))

    if (!(user && correctPswrd)) {
      throw new NoUserFoundException('Väärä nimi tai salasana', null, [{ header: 'WWW-Authenticate', value: 'Bearer' }])
    }
    const token = jwt.sign({ username: user.username, id: user.id }, config.SECRET, { expiresIn: '24h' })
    res.status(STATUS_CODES.OK).send({ message: 'Kirjautuminen onnistui!', resource: { token, username: user.username, id: user.id } })
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    // To the errorhandler in app.js
    next(handledError)
  }
})

module.exports = loginRouter
