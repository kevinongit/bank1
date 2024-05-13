const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')

const app = express()
const server = http.createServer(app)

const crypto = require('crypto')
const randomId = () => crypto.randomBytes(4).toString("hex")
const name = 'fin-complex'
const port = process.env.PORT || 8082

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
    const delay = 300

    console.log({serviceId})
    await setTimeout(() => {
      const result = `got ${serviceId} && ${name} db job (${delay}ms) and seems good.`
      res.status(200).send({result})
    }, delay)

  } catch (error) {
    console.log(error)
    res.status(401).json([])
  }
})

server.listen(port, () => {
    console.log(`✅ ${name} listening on *:${port}`)
})