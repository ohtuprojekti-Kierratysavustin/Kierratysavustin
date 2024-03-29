const config = require('./utils/config')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const productRouter = require('./controllers/products')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const productUserCounterRouter = require('./controllers/counters')
const statisticsRouter = require('./controllers/statistics')
const fileRouter = require('./controllers/file')
const adminRouter = require('./controllers/admin')
const moderatorRouter = require('./controllers/moderator')
const credentialRouter = require('./controllers/credentials')
const path = require('path')
const { devErrorHandler, productionErrorHandler } = require('./error/errorHandler')

app.use(cors())
app.use(express.json())
app.use('/api/products', productRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api' + productUserCounterRouter.URLS.BASE_URL, productUserCounterRouter.router)
app.use('/api' + statisticsRouter.URLS.BASE_URL, statisticsRouter.router)
app.use('/api/files', fileRouter)
app.use('/api/admin', adminRouter)
app.use('/api/moderator', moderatorRouter)
app.use('/api/credentials', credentialRouter)

app.use(express.static('build'))
app.get('*', (req, res) => res.sendFile(path.resolve('build', 'index.html')))

//Errorhandler for catching all uncaught errors. Overrides the default middleware: https://expressjs.com/en/guide/error-handling.html
let errorHandler

if (process.env.NODE_ENV !== 'production') {
  const testRouter = require('./controllers/tests')
  app.use('/api/tests', testRouter)
  // In dev/ environment return full stack trace of an programmer error.
  errorHandler = devErrorHandler
} else {
  // In production only userfriendly message.
  errorHandler = productionErrorHandler
}

app.use(errorHandler)

console.log('>>>>> connecting to <<<<<', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true } )
  .then(() => {
    console.log('>>>>> connected to MongoDB <<<<<')
  })
  .catch((error) => {
    console.log('>>>>> error connection to MongoDB: <<<<<', error.message)
  })


module.exports = app
