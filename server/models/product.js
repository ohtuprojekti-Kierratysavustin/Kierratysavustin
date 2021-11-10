const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tuotteen nimi vaaditaan!'],
    unique: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Tuote on yhdistettävä käyttäjään! Käyttäjän ID:tä ei annettu!'],
  },
  productImage: {
    type: mongoose.Schema.Types.String
  }
}, { timestamps: true })

//https://mongoosejs.com/docs/populate.html#populate-virtuals
productSchema.virtual('instructions', {
  ref: 'Instruction',
  localField: '_id',
  foreignField: 'product'
})

productSchema.plugin(uniqueValidator, { message: 'Tuote \'{VALUE}\' on jo järjestelmässä!' })
productSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }, virtuals: true
})

module.exports = mongoose.model('Product', productSchema)
