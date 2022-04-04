require('dotenv').config()
const express = require('express')

const indexRoute = require('./routes/index')
const competentieRoute = require('./routes/competentie')
const vragenlijstRoute = require('./routes/vragenlijst')
const vraagRoute = require('./routes/vraag')

const errorRoute = require('./routes/error')

module.exports = express()
  .use(express.json())
  .use(express.urlencoded({ extended: true }))

  .use('/', indexRoute)
  .use('/v1/competentie', competentieRoute)
  .use('/v1/vragenlijst', vragenlijstRoute)
  .use('/v1/vraag', vraagRoute)
  .use(errorRoute)
