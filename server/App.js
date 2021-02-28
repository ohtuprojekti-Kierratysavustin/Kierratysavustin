const config = require("./utils/config");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors')
const productRouter = require("./controllers/products");
const userRouter = require("./controllers/users")
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })

app.use(cors())
app.use(express.static("build"))
app.use(bodyParser.json());
app.use("/api/products", productRouter);
app.use('/api/users', userRouter)

app.use(express.static('build'))
app.get("*", (req, res) => res.sendFile(path.resolve("build", "index.html")))
console.log('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })





module.exports = app;