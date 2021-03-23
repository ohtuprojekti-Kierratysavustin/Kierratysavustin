require('dotenv').config()

let PORT = process.env.PORT || 3001
let MONGODB_URI = 'mongodb://localhost:27017/dev_db'
let SECRET = process.env.SECRET || 'salainendevaus'

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = 'mongodb://localhost:27017/test_db'
  SECRET = process.env.SECRET || 'salainentesti'
}

if (process.env.NODE_ENV === 'production') {
  MONGODB_URI = 'mongodb://kierratysavustin_db:27017/prod_db'
  SECRET = process.env.SECRET
}

module.exports = {
  MONGODB_URI,
  SECRET,
  PORT
}