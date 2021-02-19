const products = [
    {
      id: 1,
      name: 'Mustamakkarakastike pullo',
      instructions: 'Irrota korkki, huuhtele pullo. Laita pullo ja korkki muovinkeräykseen erillään toisistaan.'
    },
    {
      id: 2,
      name: 'Maitotölkki',
      instructions: 'Huuhtele tölkki. Laita litistettynä kartonkikeräykseen.'
    },
    {
      id: 3,
      name: 'Sanomalehti',
      instructions: 'Laita lehti paperinkeräykseen.'
    }
  ]


const Product = require('./models/product')
const Instruction = require('./models/instruction')
const User = require('./models/user')
const Comment = require('./models/comment')

const express = require('express')
const app = express()
const path = require('path')

const cors = require('cors')

app.use(cors())
app.use(express.json())

app.use(express.static('build'))
//app.get("*", (req, res) => res.sendFile(path.resolve("build", "index.html")))

const PORT = 3001

app.post('/api/products',(req,res) =>{
    const product = req.body
    console.log(product)
    return product
})  
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/products', (req, res) => {
    res.json(products)
})

app.get('/api/products/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log(id)
    const product = products.find(product => product.id === id)
    res.json(product)
  })

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
