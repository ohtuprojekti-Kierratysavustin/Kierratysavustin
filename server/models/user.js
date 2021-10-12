const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'Käyttäjänimi vaaditaan!'],
    minlength: [3, 'Käyttäjänimen on oltava vähintään 3 merkkiä pitkä!']
  },
  passwordHash: String,
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instruction'
    }
  ],
  dislikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instruction'
    }
  ],
})

userSchema.plugin(uniqueValidator, { message: 'Käyttäjänimi \'{VALUE}\' on jo käytössä!' })
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.passwordHash
    delete returnedObject._id
    delete returnedObject.__v
  },
})
module.exports = mongoose.model('User', userSchema)
