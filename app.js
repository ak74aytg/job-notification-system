require('dotenv').config()
const express = require('express')
const auth = require('./routes/authController.js')
const mongoConnect = require("./db.js");


const app = express()
const port = 3000
mongoConnect()

app.use(express.static('public'))
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/auth', auth)

app.listen(port, () => {
  console.log(`app is listening on port ${port}`)
})