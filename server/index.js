
const Product = require('./models/product')
const Instruction = require('./models/instruction')
const User = require('./models/user')
const Comment = require('./models/comment')


const express = require('express')
const app = express()

const cors = require('cors')

app.use(cors())
app.use(express.json())

app.use(express.static('build'))

const PORT = 3001

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})

