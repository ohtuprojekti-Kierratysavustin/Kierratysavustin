const testRouter = require('express').Router()
const Product = require('../models/product')
const Instruction = require('../models/instruction')
const User = require('../models/user')

testRouter.post('/reset', async (req, res) => {
    await Product.deleteMany({})
    await Instruction.deleteMany({})
    await User.deleteMany({})

    res.status(204).end()
})

module.exports = testRouter