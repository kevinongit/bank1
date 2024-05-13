const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')

const app = express()
const server = http.createServer(app)

const crypto = require('crypto')
const randomId = () => crypto.randomBytes(4).toString("hex")
const name = 'mci-gw'
const port = process.env.PORT || 8083

// app.use(express.json())
app.use(bodyParser.json())

/// enable req.body while http post method.
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public'))

app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/login.html')
    res.status(200).json({id: randomId(), message: `${name} is ready!`})

})

app.get(`/${name}/:serviceId`, async (req, res) => {
  try {
    const serviceId = req.params.serviceId
    console.log({serviceId})
    const core1Addr = 'http://' + (process.env.CORE_1_ADDR ||  '/localhost:8085')
    const resp = await fetch(`${core1Addr}/core1/${serviceId}`)


    const result = {
      serviceId,
      core1 : await resp.json(),
    }

    console.log({result})
    res.status(200).json(result)

  } catch (error) {
    console.log(error)
    res.status(401).json([])
  }
})

server.listen(port, () => {
    console.log(`✅ ${name} listening on *:${port}`)
})