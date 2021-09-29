const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const config = require('../utils/config')
const STATUS_CODES = require('http-status')
const { NoUserFoundException } = require('../error/exceptions')

loginRouter.post('/', async (req, res, next) => {
  try {
    const body = req.body
    const user = await User.findOne({ username: body.username })
    const correctPswrd = user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash)

    if (!(user && correctPswrd)) {
      throw NoUserFoundException('Väärä nimi tai salasana', null, [{header: 'WWW-Authenticate', value: 'Bearer'}])
    }
    const token = jwt.sign( {username: user.username, id: user.id}, config.SECRET)
    res.status(STATUS_CODES.OK).send({ token, username: user.username, id:user.id})
  } catch (error) {
    next(error)
  }
})

module.exports = loginRouter
