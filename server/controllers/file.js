const fileRouter = require('express').Router()
const multer  = require('multer')
const crypto = require('crypto')
const path = require('path')
const config = require('../utils/config')
const { restructureCastAndValidationErrorsFromMongoose, ResourceNotFoundException } = require('../error/exceptions')
const Product = require('../models/product')
const { GridFsStorage } = require('multer-gridfs-storage')

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

module.exports = fileRouter