require('dotenv').config()
const express = require('express')
const auth = require('./routes/authRoutes.js')
const user = require('./routes/userRoutes.js')
const mongoConnect = require("./db.js");


const app = express()
const port = 5000
mongoConnect()

app.use(express.static('public'))
app.use('/uploads', express.static('uploads'));
app.use('/notices', express.static('notices'));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/auth', auth)
app.use('/api', user)

app.listen(port, () => {
  console.log(`app is listening on port ${port}`)
})