const config = require("./utils/config");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors')
const productRouter = require("./controllers/products");
const path = require('path')
app.use(cors())
app.use(bodyParser.json());
app.use('/api/products', productRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'))
  app.get("*", (req, res) => res.sendFile(path.resolve("build", "index.html")))
}

const http = require('http')
const server = http.createServer(app)

console.log('>>>>> connecting to <<<<<', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true } )
  .then(() => {
    console.log('>>>>> connected to MongoDB <<<<<')
  })
  .catch((error) => {
    console.log('>>>>> error connection to MongoDB: <<<<<', error.message)
  })

 server.listen(config.PORT, () => {
   console.log(`Server running on port ${config.PORT}`)
 })