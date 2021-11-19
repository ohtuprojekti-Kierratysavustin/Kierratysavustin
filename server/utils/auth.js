const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const { TokenMissingException, InvalidTokenException, NoUserFoundException, InvalidParameterException, UnauthorizedException } = require('../error/exceptions')
const { roleExists, roleIsEqualOrHigher } = require('./roles')

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

/**
 * Authenticate user from the JWT bearer token given in the request. 
 * Has to be called with await! Otherwise authentication will be passed!
 * @param {*} req the request object
 * @returns user object
 * @throws error if authentication does not succeed
 */
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

/**
 * Authorizes the user based on the users role, or throws error if user does not have the right role
 * If not used in a resource, anyone can access. Same as auhtorizing for role 'User'
 * @param {*} user object
 * @param {*} minimumAcceptedRole role Object
 * @returns user
 */
const authorizeUser = (user, minimumAcceptedRole) => {
  if (!roleExists(user.role)) {
    throw new InvalidParameterException('Given role: ' + user.role + ' is not a valid role!')
  }
  if (!roleExists(minimumAcceptedRole.name)) {
    throw new InvalidParameterException('Given minimum accepted role: ' + minimumAcceptedRole.name + ' is not a valid role!')
  }

  if (!roleIsEqualOrHigher(user.role, minimumAcceptedRole.name)) {
    throw new UnauthorizedException()
  }

  return user
}

module.exports.authenticateRequestReturnUser = authenticateRequestReturnUser
module.exports.authenticateRequest = authenticateRequest
module.exports.authorizeUser = authorizeUser
