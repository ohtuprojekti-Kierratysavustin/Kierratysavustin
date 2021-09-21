const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const productUserRecycleCountSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  count: {
    type: Number,
    min: 0,
    default: 0
  }
})

productUserRecycleCountSchema.plugin(uniqueValidator)
productUserRecycleCountSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('ProductUserRecycleCount', productUserRecycleCountSchema)