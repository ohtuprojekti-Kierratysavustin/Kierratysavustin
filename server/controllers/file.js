const fileRouter = require('express').Router()
const mongoose = require('mongoose')
const multer  = require('multer')
const { GridFsStorage } = require('multer-gridfs-storage')
const crypto = require('crypto')
const path = require('path')
const Product = require('../models/product')
const { restructureCastAndValidationErrorsFromMongoose, ResourceNotFoundException, InvalidParameterException, UnauthorizedException } = require('../error/exceptions')
const STATUS_CODES = require('http-status')
const authUtils = require('../utils/auth')

const SUPPORTED_IMAGETYPES = new RegExp('image/*')
const IMAGE_SIZE_LIMIT = 1000000 // image size limit in bytes

let gfs
let storage
let store

const connection = mongoose.connection
// init storage and store, once db connection is open
connection.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(connection.db, {
    bucketName: 'uploads'
  })

  storage = new GridFsStorage({
    db: mongoose.connection,
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

  store = multer({
    storage,
    limits: {fileSize: IMAGE_SIZE_LIMIT},
    fileFilter: function(req, file, cb){
      if (!SUPPORTED_IMAGETYPES.test(file.mimetype)) {
        return cb(null, false)
      }
      cb(null, true)
    }
  }).single('image')
})

const uploadMiddleware = (req, res, next) => {
  store(req, res, function(err) {
    try {
      if (err instanceof multer.MulterError) {
        throw new InvalidParameterException('Antamasi tiedosto on liian suuri!. Suurin sallittu koko: ' + IMAGE_SIZE_LIMIT/1000000 + 'Mt')
      } else if (!req.file) {
        throw new InvalidParameterException('Antamasi tiedosto ei ole tuetussa tiedostomuotossa!')
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

const deleteImage = (filename) => {
  gfs.find({ filename: filename }).toArray((err, files) => {
    if (!files.length === 0 && files) {
      gfs.delete(files[0]._id, (err) => {
        if (err) console.log(err)
      })
    }
  })
}

/*
Kuvan tallentaminen tietokantaan.
Kuvan tallettaminen etenee ketjussa: uploadMiddleware - store (multer) - storage (GridFsStorage).
UploadMiddleware nappaa kyselyn käsittelyyn ennen sen siirtymistä routerille. Se lähettää kyselyn storelle eli
multerille, joka kaivelee form-datasta tarvittavat tiedot, tallettaa ne kyselyn kenttiin, validoi tiedoston 
ja tallettaa sen käyttäen mongon GridFsStoragea.
GridFsStorage uudelleennimeää tiedoston, palastelee sen chunkkeihin ja tallettaa palat sekä tiedoston tiedot
tauluun nimeltä uploads.
Jos tiedosto on validi ja saadaan talletettua tietotkantaan, jatkuu homma routerin puolella, jossa tuotteen
tietoihin talletetaan vielä tieto siitä millä nimellä tiedosto löytyy tietokannasta.
*/
fileRouter.post('/upload/product', uploadMiddleware, async (req, res, next) => { 
  try {
    let user = await authUtils.authenticateRequestReturnUser(req)
    const productID = req.query.id
    const product = await Product.findById(productID).exec()
    if (!product) {
      throw new ResourceNotFoundException('Tuotetta ID:llä: ' + productID + ' ei löytynyt!')
    }
    if (product.user.toString() !== user.id.toString()) {
      deleteImage(req.file.filename)
      throw new UnauthorizedException('Vain tuotteen luoja voi lisätä tuotteelle kuvan!')
    }

    const oldImage = product.productImage
    console.log(req.file)
    product.productImage = req.file.filename
    await product.save()
    
    deleteImage(oldImage)
    
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

// Kuvan haku tietokannasta tiedoston nimellä.
fileRouter.get('/images/:filename', async (req, res, next) => {
  try {
    gfs.find({ filename: req.params.filename }).toArray((err, files) => {
      if (files.length === 0 || !files || !SUPPORTED_IMAGETYPES.test(files[0].contentType)) {
        return res.status(STATUS_CODES.NOT_FOUND).send('no such file')
      } else {
        const _id = files[0]._id
        gfs.openDownloadStream(_id).pipe(res)
      }
    })
  } catch (error) {
    let handledError = restructureCastAndValidationErrorsFromMongoose(error)
    // To the errorhandler in app.js
    next(handledError)
  }
})

module.exports = fileRouter