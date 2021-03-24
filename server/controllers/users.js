const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.post('/', async (req, res) => {
  try {
    const body = req.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    const user = new User({
      username: body.username,
      passwordHash,
    })
    const savedUser = await user.save()
    res.json(savedUser)
  } catch (error) {
    return res.status(400).send('already in use')
  }
})

module.exports = userRouter
