const { clearDatabase } = require('../tests/test_helper')
const testRouter = require('express').Router()
const STATUS_CODES = require('http-status')


testRouter.post('/reset', async (req, res) => {
  clearDatabase()
    .then(() => {
      res.status(STATUS_CODES.NO_CONTENT).end()
    })
    .catch(() => {
      res.status(STATUS_CODES.IM_A_TEAPOT).end()
    })
  
})

module.exports = testRouter
