const productUserRecycleCountRouter = require('express').Router()
const Product = require('../models/product')
const ProductUserRecycleCount = require('../models/productUserRecycleCount')

const authUtils = require('../utils/auth')
// const NoUserFoundException = authUtils.NoUserFoundException

productUserRecycleCountRouter.post('/', async (req, res) => {
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

    let productUserRecycleCount = await ProductUserRecycleCount.findOne({ userID: user.id, productID: product.id })
    if (!productUserRecycleCount) {
      productUserRecycleCount = new ProductUserRecycleCount({
        userID: user.id,
        productID: product.id
      })
    }

    productUserRecycleCount.count += body.amount
    if (productUserRecycleCount.count < 0) {
      return res.status(401).json({ error: 'Product recycled count can not be smaller than 0!' })
    }

    await productUserRecycleCount.save()
  } catch (error) {
    console.log('Unexpected Error updating product recycle count :>> ', error)
    return res.status(400).json({ error: 'An unexpected error happened!' })
  }

  res.status(201).send('Product recycle statistics updated!')
})

productUserRecycleCountRouter.get('/', async (req, res) => {
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

    const productUserRecycleCount = await ProductUserRecycleCount.findOne({ userID: user.id, productID: product.id })
    if (!productUserRecycleCount) {
      return res.status(200).json({
        productID: product.id,
        count: 0
      })
    }

    return res.status(200).json({
      productID: product.id,
      count: productUserRecycleCount.count
    })
  } catch (error) {
    console.log('Unexpected Error getting product recycle count :>> ', error)
    return res.status(400).json({ error: 'An unexpected error happened!' })
  }
})


module.exports = productUserRecycleCountRouter
