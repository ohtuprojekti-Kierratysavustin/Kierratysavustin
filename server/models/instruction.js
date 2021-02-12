const mongoose = require("mongoose")

const instructionSchema = new mongoose.Schema({
    score: {type: Number, required: true},
    information: {type:String, required:true}

})

module.exports = mongoose.model("Instruction", instructionSchema)