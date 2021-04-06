const config = require('./utils/config')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const productRouter = require('./controllers/products')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const path = require('path')
app.use(cors())
app.use(express.json())
app.use('/api/products', productRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)


if (process.env.NODE_ENV === 'test') {
  const testRouter = require('./controllers/tests')
  app.use('/api/tests', testRouter)
}
app.use(express.static('build'))
app.get('*', (req, res) => res.sendFile(path.resolve('build', 'index.html')))

console.log('>>>>> connecting to <<<<<', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true } )
  .then(() => {
    console.log('>>>>> connected to MongoDB <<<<<')
  })
  .catch((error) => {
    console.log('>>>>> error connection to MongoDB: <<<<<', error.message)
  })


module.exports = app
