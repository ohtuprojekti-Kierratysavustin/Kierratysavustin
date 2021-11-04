const mongoose = require('mongoose')

const instructionSchema = new mongoose.Schema({
  score: {
    type: Number,
    default: 0,
    cast: 'Tykkäysten määrän on oltava numeerinen. Annettiin: {VALUE}.'
  },
  information: {
    type: String,
    required: [true, 'Ohjetta ei annettu!'],
    minlength: [3, 'Ohjeen on oltava vähintään 3 merkkiä pitkä!']
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Ohje on yhdistettävä tuotteeseen! Tuotteen ID:tä ei annettu!'],
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Ohje on yhdistettävä käyttäjään! Käyttäjän ID:tä ei annettu!'],
  }
})

instructionSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Instruction', instructionSchema)
