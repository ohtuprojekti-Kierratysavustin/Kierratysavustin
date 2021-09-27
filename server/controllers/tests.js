const { clearDatabase } = require('../tests/test_helper')

const testRouter = require('express').Router()


testRouter.post('/reset', async (req, res) => {
  clearDatabase()
    .then(() => {
      res.status(204).end()
    })
    .catch(() => {
      res.status(418).end()
    })
  
})

module.exports = testRouter
