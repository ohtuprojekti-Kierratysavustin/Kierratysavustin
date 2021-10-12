const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Tuotteen nimi vaaditaan!'],
    unique: true 
  },
  instructions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instruction',
    },
  ],
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Tuote on yhdistettävä käyttäjään! Käyttäjän ID:tä ei annettu!'],
  }
})

productSchema.plugin(uniqueValidator, { message: 'Tuote \'{VALUE}\' on jo järjestelmässä!' })
productSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    //delete returnedObject.users
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Product', productSchema)
