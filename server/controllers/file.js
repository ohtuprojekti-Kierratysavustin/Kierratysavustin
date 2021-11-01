const fileRouter = require('express').Router()
const multer  = require('multer')
const crypto = require('crypto')
const path = require('path')
const config = require('../utils/config')
const { restructureCastAndValidationErrorsFromMongoose, ResourceNotFoundException } = require('../error/exceptions')
const Product = require('../models/product')
const { GridFsStorage } = require('multer-gridfs-storage')
//const Grid = require('gridfs-stream')
const mongoose = require('mongoose')

//let mongoDriver = mongoose.mongo
let connection =  mongoose.createConnection(config.MONGODB_URI)//mongoose.connection
let gfs
connection.once('open', () => {
  console.log('gfs connection open')
  gfs = new mongoose.mongo.GridFSBucket(connection.db, {
    bucketName: 'uploads'
  })
})

const storage = new GridFsStorage({
  url: config.MONGODB_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err)
        }
        const filename = buf.toString('hex') + path.extname(file.originalname)
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        }
        resolve(fileInfo)
      })
    })
  }
})

const upload = multer({ storage })

fileRouter.post('/upload/product', upload.single('image'), async (req, res, next) => {
  try {
    const productID = req.query.id
    const product = await Product.findById(productID).exec()
    if (!product) {
      throw new ResourceNotFoundException('Tuotetta ID:llä: ' + productID + ' ei löytynyt!')
    }

    product.productImage = req.file.filename
    product.save()

    res.json( req.file )
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    // To the errorhandler in app.js
    next(handledError)
  }
})

fileRouter.get('/images/:filename', async (req, res, next) => {
  try {
    gfs.find({ filename: req.params.filename }).toArray((err, files) => {
      if (!files) {
        throw new ResourceNotFoundException('Kuvaa nimellä' + req.params.filename + 'ei löytynyt!')
      }
      const _id = files[0]._id
      gfs.openDownloadStream(_id).pipe(res)
    })
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    // To the errorhandler in app.js
    next(handledError)
  }
})

module.exports = fileRouter