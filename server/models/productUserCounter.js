const mongoose = require('mongoose')

const productUserCounterSchema = new mongoose.Schema({
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
  recycleCount: {
    type: Number,
    min: [0, 'Tuotteen kierrätystilasto ei voi olla pienempi kuin 0!'],
    default: 0,
    cast: 'Kierrätystilaston on oltava numeerinen! Annettiin: \'{VALUE}\''
  },
  purchaseCount: {
    type: Number,
    min: [0, 'Hankintatilasto ei voi olla pienempi kuin 0!'],
    default: 0,
    cast: 'Hankintatilaston on oltava numeerinen! Annettiin: \'{VALUE}\''
  }
})

productUserCounterSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('ProductUserCounter', productUserCounterSchema)