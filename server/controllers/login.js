const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const loginRouter = require("express").Router()
const User = require("../models/user")
require("dotenv").config()
loginRouter.post("/", async (req, res) => {
  const body = req.body
  const user = await User.findOne({ username: body.username })
  console.log(user)
  const correctPswrd =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && correctPswrd)) {
    return res.status(401).json({ error: "Väärä nimi tai salasana" })
  }
  const userToken = {
    username: user.username,
    id: user.id,
  }
  const token = jwt.sign(userToken, process.env.SECRET)

  res.status(200).json({ token, username: user.username })
})
module.exports = loginRouter
