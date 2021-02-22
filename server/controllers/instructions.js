
const instructionRouter = require("express").Router()
const { json } = require("express")
const Instruction = require('../models/instruction')
const Product = require("../models/product")

instructionRouter.post('/:id/instructions', async(req,res) => {
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

module.exports = instructionRouter;