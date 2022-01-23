const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mong = require('mongoose')
const apiRoutes = require('./routes.js')
const bodyParse = require('body-parser')

mong.connect(process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology: true})


app.use(cors())
app.use(express.static('public'))
app.use(bodyParse.urlencoded({extended:true}))
app.use(bodyParse.json())

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use('/api',apiRoutes)





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
