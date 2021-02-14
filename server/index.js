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

const cors = require('cors')

app.use(cors())
app.use(express.json())

app.use(express.static('build'))

const PORT = 3001

  
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/products', (req, res) => {
    res.json(products)
})

app.get('/api/products/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    const product = products.find(product => product.id === id)
    response.json(product)
  })

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
