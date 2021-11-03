const fileRouter = require('express').Router()
const multer  = require('multer')
const crypto = require('crypto')
const path = require('path')
const config = require('../utils/config')
const { restructureCastAndValidationErrorsFromMongoose, ResourceNotFoundException, InvalidParameterException } = require('../error/exceptions')
const Product = require('../models/product')
const STATUS_CODES = require('http-status')
const { GridFsStorage } = require('multer-gridfs-storage')
const mongoose = require('mongoose')

let connection =  mongoose.createConnection(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
let gfs

const SUPPORTED_IMAGETYPES = new RegExp('image/*')
const IMAGE_SIZE_LIMIT = 1000000 // image size in bytes

connection.once('open', () => {
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

const store = multer({
  storage,
  limits: {fileSize: IMAGE_SIZE_LIMIT},
  fileFilter: function(req, file, cb){
    if (!SUPPORTED_IMAGETYPES.test(file.mimetype)) {
      return cb(null, false)
    }
    cb(null, true)
  }
}).single('image')

const uploadMiddleware = (req, res, next) => {
  store(req, res, function(err) {
    try {
      if (err instanceof multer.MulterError) {
        throw new InvalidParameterException('Antamasi tiedosto on liian suuri!. Suurin sallittu koko: ' + IMAGE_SIZE_LIMIT/1000000 + 'Mt')
      } else if (!req.file) {
        throw new ResourceNotFoundException('Antamasi tiedosto ei ole tuetussa tiedostomuotossa!')
      } else if (err) {
        throw new InvalidParameterException(err.message)
      }
      next()
    } catch (error) {
      let handledError = restructureCastAndValidationErrorsFromMongoose(error)
      // To the errorhandler in app.js
      next(handledError)
    }
  })
}

fileRouter.post('/upload/product', uploadMiddleware, async (req, res, next) => {
  try {
    const productID = req.query.id
    const product = await Product.findById(productID).exec()
    if (!product) {
      throw new ResourceNotFoundException('Tuotetta ID:llä: ' + productID + ' ei löytynyt!')
    }
    product.productImage = req.file.filename
    await product.save()
    res.status(STATUS_CODES.OK)
      .json(
        {
          message: 'Kuva lisätty onnistuneesti!',
          resource: product
        }
      )
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