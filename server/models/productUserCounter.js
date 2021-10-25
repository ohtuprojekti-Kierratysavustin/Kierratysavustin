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
    max: [1e17, 'Et varmasti ole kierrättänyt noin montaa tuotetta!'],
    validate: {
      validator: function() { 
        return this.recycleCount <= this.purchaseCount
      },
      message: 'Kierrätettyjen tuotteiden lukumäärä ei voi olla suurempi kuin hankittujen tuotteiden lukumäärä'
    },
    default: 0,
    cast: 'Kierrätystilaston on oltava numeerinen! Annettiin: \'{VALUE}\''
  },
  purchaseCount: {
    type: Number,
    min: [0, 'Hankintatilasto ei voi olla pienempi kuin 0!'],
    max: [1e17, 'Et varmasti ole hankkinut noin montaa tuotetta!'],
    validate: {
      validator: function() { 
        return this.recycleCount <= this.purchaseCount
      },
      message: 'Kierrätettyjen tuotteiden lukumäärä ei voi olla suurempi kuin hankittujen tuotteiden lukumäärä'
    },
    default: 0,
    cast: 'Hankintatilaston on oltava numeerinen! Annettiin: \'{VALUE}\''
  }
},{ timestamps: true })

productUserCounterSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('ProductUserCounter', productUserCounterSchema)