const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type:String, required:true},
    instructions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Instruction'
        }
    ],
})

productSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model("Product", productSchema)

