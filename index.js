const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const restResource = require('./src/rest-resource')

const app = express()
const port = process.argv.length > 2 ? parseInt(process.argv[2]) : 3000

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Restful app.')
})

app.use(restResource)

app.listen(port, () => {
  console.log(`Restful app listening at http://localhost:${port}`)
})
