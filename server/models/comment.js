const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  score: { type: Number, required: true },
})

module.exports = mongoose.model("Comment", commentSchema)
