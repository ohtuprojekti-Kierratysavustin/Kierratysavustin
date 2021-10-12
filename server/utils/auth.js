const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const { TokenMissingException, InvalidTokenException, NoUserFoundException } = require('../error/exceptions')

const getTokenFromRequest = (req) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

// Has to be called with await! Otherwise authentication will be passed!
const authenticateRequest = async (req) => {
  const token = getTokenFromRequest(req)
  if (!token) {
    throw new TokenMissingException(null, null, [{header: 'WWW-Authenticate', value: 'Bearer'}])
  }

  let decodedToken
  try {
    decodedToken = jwt.verify(token, config.SECRET)
  } catch (error) {
    throw new InvalidTokenException(null, null, [{header: 'WWW-Authenticate', value: 'Bearer'}])
  }
  if (!decodedToken) {
    throw new InvalidTokenException(null, null, [{header: 'WWW-Authenticate', value: 'Bearer'}])
  }
}

// Has to be called with await! Otherwise authentication will be passed!
const authenticateRequestReturnUser = async (req) => {
  const token = getTokenFromRequest(req)
  if (!token) {
    throw new TokenMissingException(null, null, [{header: 'WWW-Authenticate', value: 'Bearer'}])
  }

  let decodedToken
  try {
    decodedToken = jwt.verify(token, config.SECRET)
  } catch (error) {
    if (error.name === 'JsonWebTokenError' && (error.message === 'invalid signature' || error.message === 'jwt malformed')) {
      throw new InvalidTokenException(null, null, [{header: 'WWW-Authenticate', value: 'Bearer'}])
    }
    throw error
  }
  if (!decodedToken) {
    throw new InvalidTokenException(null, null, [{header: 'WWW-Authenticate', value: 'Bearer'}])
  }

  const user = await User.findById(decodedToken.id)
  if (!user) {
    throw new NoUserFoundException(null, null, [{header: 'WWW-Authenticate', value: 'Bearer'}])
  }

  return user
}

module.exports.authenticateRequestReturnUser = authenticateRequestReturnUser
module.exports.authenticateRequest = authenticateRequest
