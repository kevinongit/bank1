const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')

const app = express()
const server = http.createServer(app)

const crypto = require('crypto')
const randomId = () => crypto.randomBytes(4).toString("hex")
const name = 'front-was'
const port = process.env.PORT || 8081

// app.use(express.json())
app.use(bodyParser.json())

/// enable req.body while http post method.
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public'))

app.get('/', (req, res) => {
  // res.sendFile('index.html')
    res.status(200).json({id: randomId(), message: `${name} is ready!`})

})

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html')
    // res.status(200).json({id: randomId(), message: `${name} is ready!`})

})

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/public/register.html')
})
app.post('/api/v1/login', async (req, res) => {
  try {
    console.log(req.body)
    const { userId } = req.body
    // res.status(200).json({res: 'ok'})
      const customerBsAddr = 'http://' + (process.env.CUSTOMER_BS_ADDR || 'localhost:9001')
      console.log({userId, customerBsAddr})
      const fetchResult = await fetch(`${customerBsAddr}/customer/${userId}`)
  
      const result = await fetchResult.json()
      
      res.status(200).json(result)
  
//     const customerBsAddr = 'http://' + (process.env.CUSTOMER_BS_ADDR || 'localhost:9001')
//     const resp = await fetch(`${customerBsAddr}/customer/`,{
//       method: "POST",
//       mode: "cors",
//       cache: "no-cache",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: customer,
//     })
// console.log(resp)
//     if (resp.result) {
//       res.status(200).json(resp)
//     } else {
//       res.status(401).json(resp)
//     }
  } catch (error) {
    console.log(error)
    const result = {
      status: false,
      reason: error.message,
    }
    res.status(401).json(result)
  }
})


app.get(`/${name}/:serviceId`, async (req, res) => {
  try {
    const serviceId = req.params.serviceId
    console.log({serviceId})
    const finComplexAddr = 'http://' + (process.env.FIN_COMPLEX_ADDR || 'localhost:8082')
    const resp = await fetch(`${finComplexAddr}/fin-complex/${serviceId}`)

    const mciGwAddr = 'http://' + (process.env.MCI_GW_ADDR || 'localhost:8083') 
    const resp2 = await fetch(`${mciGwAddr}/mci-gw/${serviceId}`)

    const result = {
      serviceId,
      finComplex : await resp.json(),
      mci: await resp2.json(),
    }
    res.status(200).json(result)

  } catch (error) {
    console.log(error)
    res.status(401).json([])
  }
})

app.get(`/customer/:userId`, async (req, res) => {
  try {
    const { userId } = req.params
    const customerBsAddr = 'http://' + (process.env.CUSTOMER_BS_ADDR || 'localhost:9001')
    console.log({userId, customerBsAddr})
    const resp = await fetch(`${customerBsAddr}/customer/${userId}`)

    const result = {
      userId,
      customer : await resp.json(),
    }
    res.status(200).json(result)

  } catch (error) {
    console.log(error)
    res.status(401).json([])
  }
})

app.post('/api/v1/register', async (req, res) => {
  try {
    const customer = req.body
    console.log({customer})
    const customerBsAddr = 'http://' + (process.env.CUSTOMER_BS_ADDR || 'localhost:9001')
    const fetchResult = await fetch(`${customerBsAddr}/customer/`,{
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customer),
    })
    const resp = await fetchResult.json()
console.log({resp})
    if (resp.status) {
      // res.sendFile(__dirname + '/public/test_ok.html')
      res.status(200).json(resp)
    } else {
      // res.sendFile(__dirname + '/public/register.html')
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