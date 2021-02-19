
const productRouter = require("express").Router()
const Product = require('../models/product')

productRouter.post('/api/products', async(req,res) => {
    const body = req.body
    console.log("MOI")
    const product = new Product({
    name: body.name,
    description: body.description
})
product.save().then(result => {
    response.json(result)
})
})

productRouter.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

productRouter.get('/api/products', (req, res) => {
    res.json(products)
})

productRouter.get('/api/products/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log(id)
    const product = products.find(product => product.id === id)
    res.json(product)
  })


module.exports = productRouter;