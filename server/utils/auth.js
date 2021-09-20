const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../utils/config');


// Define exceptions to throw on failed token authentication
function TokenMissingException(message) {
    this.message = message;
    // Use V8's native method if available, otherwise fallback
    if ("captureStackTrace" in Error)
        Error.captureStackTrace(this, TokenMissingException);
    else
        this.stack = (new Error()).stack;
}

TokenMissingException.prototype = Object.create(Error.prototype);
TokenMissingException.prototype.name = "TokenMissingException";
TokenMissingException.prototype.constructor = TokenMissingException;

function InvalidTokenException(message) {
    this.message = message;
    // Use V8's native method if available, otherwise fallback
    if ("captureStackTrace" in Error)
        Error.captureStackTrace(this, InvalidTokenException);
    else
        this.stack = (new Error()).stack;
}

InvalidTokenException.prototype = Object.create(Error.prototype);
InvalidTokenException.prototype.name = "InvalidTokenException";
InvalidTokenException.prototype.constructor = InvalidTokenException;

function NoUserFoundException(message) {
    this.message = message;
    // Use V8's native method if available, otherwise fallback
    if ("captureStackTrace" in Error)
        Error.captureStackTrace(this, NoUserFoundException);
    else
        this.stack = (new Error()).stack;
}

NoUserFoundException.prototype = Object.create(Error.prototype);
NoUserFoundException.prototype.name = "NoUserFoundException";
NoUserFoundException.prototype.constructor = NoUserFoundException;

const getTokenFromRequest = (req) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}


const authenticateRequest = async (req) => {
    const token = getTokenFromRequest(req)
    if (!token) {
        throw new TokenMissingException("Token missing from request");
    }

    const decodedToken = jwt.verify(token, config.SECRET)
    if (!decodedToken) {
        throw new InvalidTokenException("Given token is invalid");
    }
}

const authenticateRequestReturnUser = async (req) => {
    const token = getTokenFromRequest(req)
    if (!token) {
        throw new TokenMissingException("Token missing from request");
    }

    const decodedToken = jwt.verify(token, config.SECRET)
    if (!decodedToken) {
        throw new InvalidTokenException("Given token is invalid");
    }

    const user = await User.findById(decodedToken.id)
    if (!user) {
        throw new NoUserFoundException("User not found with the given token");
    }

    return user;
}

module.exports.TokenMissingException = TokenMissingException;
module.exports.NoUserFoundException = NoUserFoundException;
module.exports.InvalidTokenException = InvalidTokenException;
module.exports.authenticateRequestReturnUser = authenticateRequestReturnUser;
module.exports.authenticateRequest = authenticateRequest;
