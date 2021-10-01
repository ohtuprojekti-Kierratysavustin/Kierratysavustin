const productCounterRouter = require('express').Router()
const Product = require('../models/product')
const ProductCounter = require('../models/productCounter')

const authUtils = require('../utils/auth')

productCounterRouter.post('/', async (req, res) => {
  let user
  try {
    user = await authUtils.authenticateRequestReturnUser(req)
  } catch (e) {
    res.setHeader('WWW-Authenticate', 'Bearer')
    return res.status(401).json({ error: e.message })
  }
  try {
    const body = req.body

    const product = await Product.findById(body.productID)
    if (!product) {
      return res.status(404).json({ error: 'Product not found!' })
    }

    let productCounter = await ProductCounter.findOne({ userID: user.id, productID: product.id })
    if (!productCounter) {
      productCounter = new ProductCounter({
        userID: user.id,
        productID: product.id
      })
    }

    if (body.type === 'recycle') {
      productCounter.recycleCount += body.amount
      if (productCounter.recycleCount < 0) {
        return res.status(401).json({ error: 'Product recycled count can not be smaller than 0!' })
      }
    } else if (body.type === 'purchase') {
      productCounter.purchaseCount += body.amount
      if (productCounter.purchaseCount < 0) {
        return res.status(401).json({ error: 'Product purchase count can not be smaller than 0!' })
      }
    }
    
    await productCounter.save()
  } catch (error) {
    console.log('Unexpected Error updating product recycle or purchase count :>> ', error)
    return res.status(400).json({ error: 'An unexpected error happened!' })
  }

  if (req.body.type === 'recycle') {
    res.status(201).send('Product recycle count updated!')
  } else if (req.body.type === 'purchase') {
    res.status(201).send('Product purchase count updated!')
  }
  
})

productCounterRouter.get('/', async (req, res) => {
  let user
  try {
    user = await authUtils.authenticateRequestReturnUser(req)
  } catch (e) {
    res.setHeader('WWW-Authenticate', 'Bearer')
    return res.status(401).json({ error: e.message })
  }

  try {
    const product = await Product.findById(req.query.productID)
    if (!product) {
      return res.status(404).json({ error: 'Product not found!' })
    }

    const productCounter = await ProductCounter.findOne({ userID: user.id, productID: product.id })
    if (!productCounter) {
      return res.status(200).json({
        productID: product.id,
        recycleCount: 0,
        purchaseCount: 0
      })
    }

    if (req.query.type === 'recycle') {
      return res.status(200).json({
        productID: product.id,
        recycleCount: productCounter.recycleCount
      })
    } else if (req.query.type === 'purchase') {
      return res.status(200).json({
        productID: product.id,
        purchaceCount: productCounter.purchaseCount
      })
    }
    
  } catch (error) {
    console.log('Unexpected Error getting product recycle or purchase count :>> ', error)
    return res.status(400).json({ error: 'An unexpected error happened!' })
  }
})


module.exports = productCounterRouter
