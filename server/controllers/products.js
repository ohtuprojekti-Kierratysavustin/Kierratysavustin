const productRouter = require("express").Router()
const Product = require('../models/product')
const Instruction = require('../models/instruction')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        
        return authorization.substring(7)
    }
    return null
}

productRouter.post('/', async(req,res) => {
    require('dotenv').config(); 
    
    const body = req.body

    const token = getTokenFrom(req)

    try{
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!token || !decodedToken) {
          return res.status(401).json({ error: 'token missing or invalid' })
        }
    }catch{
        return res.status(401).json({ error: 'not logged in' })
    }
    
    

    const product = new Product({
    name: body.productName,
    description: body.description
    })
    const result = await product.save()

    res.status(201).json(result)

})

productRouter.post('/:id/instructions', async(req,res) => {
    require('dotenv').config(); 
    const token = getTokenFrom(req)
    try{
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!token || !decodedToken) {
            console.log('virhe tokenissa')
            return res.status(401).json({ error: 'token missing or invalid' })
          }
    }catch{
        console.log('f')
        return res.status(401).json({ error: 'not logged in' })
    }
    const product = await Product.findById(req.params.id)
    if(!product){
        return res.status(401).json({ error: "No product" });
    }
    
    const instruction = new Instruction(req.body)
    instruction.product = product.id
    const result = await instruction.save()

    product.instructions = product.instructions.concat(result)

    await product.save()

    res.status(201).json(result)
})


productRouter.get('/',async (req, res) => {
    const products = await Product.find({}).populate('instructions',{ information:1 })
    res.json(products.map(product => product.toJSON()))
})

productRouter.get('/:id', (req, res) => {
    console.log(req)
    Product.findById(req.params.id).then(product => {
        console.log(product)
        res.json(product)
    })
})

module.exports = productRouter;