
const productRouter = require("express").Router()
const Product = require('../models/product')
const Instruction = require('../models/instruction')

productRouter.post('/', async(req,res) => {
    
    const body = req.body
    console.log("body",body)
   
        const product = new Product({
        name: body.productName,
        description: body.description
    })
    const result = await product.save()

    res.status(201).json(result.toJSON())

})

productRouter.post('/:id/instructions', async(req,res) => {
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
    const products = await Product.find({}).populate('instructions',{information:1})
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