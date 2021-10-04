const mongoose = require('mongoose')

const productUserRecycleCountSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Käyttäjän ID vaaditaan!']
  },
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Tuotteen ID vaaditaan!']
  },
  count: {
    type: Number,
    min: [0, 'Tuotteen kierrätystilasto ei voi olla pienempi kuin 0!'],
    default: 0,
    cast: 'Kierrätystilaston on oltava numeerinen!'
  }
})

productUserRecycleCountSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('ProductUserRecycleCount', productUserRecycleCountSchema)