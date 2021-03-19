const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const loginRouter = require("express").Router()
const User = require("../models/user")
const config = require("../utils/config")

loginRouter.post("/", async (req, res) => {
  try {
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
    const token = jwt.sign(user.username, config.SECRET)

    res.status(200).json({ token, username: user.username })
  } catch (error) {
    return res.status(401).json({ error: "Väärä nimi tai salasana" })
  }
})
module.exports = loginRouter
