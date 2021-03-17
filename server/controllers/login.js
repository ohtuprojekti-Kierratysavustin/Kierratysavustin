const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const { response } = require('express')
loginRouter.post('/', async (req, res) => {
    try {
        require('dotenv').config(); const body = req.body
        const user = await User.findOne({ username: body.username })
        const correctPswrd = user === null ? false : await bcrypt.compare(body.password, user.passwordHash)
        if (!(user && correctPswrd)) { return res.status(401).json({ error: "Väärä nimi tai salasana" }) } const token = jwt.sign(user.username, process.env.SECRET)
        res.status(200).send({ token, username: user.username, name: user.name })
    }
    catch (error) {
        console.log(error)
        return res.status(401).json({ error: "Väärä nimi tai salasana" })
    }
})
module.exports = loginRouter