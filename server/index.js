/*const products = [
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

require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')

app.use(cors())
app.use(express.json())



//const PORT = 3001
/*
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
  */
 const http = require('http')
 const config = require('./utils/config')
 const app = require('./App')
 
 const server = http.createServer(app)

 server.listen(config.PORT, () => {
   console.log(`Server running on port ${config.PORT}`)
 })
