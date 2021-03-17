const mongoose = require("mongoose")

const instructionSchema = new mongoose.Schema({
    //score: {type: Number, required: true},
    information: {type:String, required:true},
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }

})

instructionSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model("Instruction", instructionSchema)