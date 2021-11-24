const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const restResource = require('./rest-resource')

const app = express()

app.use(bodyParser.json())
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    '-',
    tokens['response-time'](req, res), 'ms',
    '\n-', 'Request Query: ', JSON.stringify(req.query),
    '\n-', 'Request Body: ', JSON.stringify(req.body),
  ].join(' ')
}))
app.use(cors())

app.get('/', (req, res) => {
  res.send('Restful app.')
})

app.use(restResource)

module.exports = app
