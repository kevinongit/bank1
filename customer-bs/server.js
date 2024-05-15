require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')

const app = express()
const server = http.createServer(app)

const crypto = require('crypto')
const randomId = () => crypto.randomBytes(4).toString("hex")
const name = 'customer-bs'
const port = process.env.PORT || 9001

const customerService = require('./db/customer.service')

// app.use(express.json())
app.use(bodyParser.json())

/// enable req.body while http post method.
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public'))

app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/login.html')
    res.status(200).json({id: randomId(), message: `${name} is ready!`})

})

app.get('/customer/:userId', async (req, res) => {
  try {
    const { params: { userId }} = req
    const resp = await customerService.findOne(userId)

    if (resp.result) {
      res.status(200).json(resp)
    } else {
      res.status(401).json(resp)
    }
  } catch (error) {
    console.log(error)
    const result = {
      status: false,
      reason: error.message,
    }
    res.status(401).json(result)
  }
})

app.post('/customer', async (req, res) => {
  try {
    const customer = req.body
    console.log({customer})
    const resp = await customerService.create(customer)
    console.log({resp})

    if (resp.result) {
      res.status(200).json(resp)
    } else {
      res.status(401).json(resp)
    }
  } catch (error) {
    console.log(error)
    const result = {
      status: false,
      reason: error.message,
    }
    res.status(401).json(result)
  }
})

server.listen(port, () => {
    console.log(`✅ ${name} listening on *:${port}`)
})