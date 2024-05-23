require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");

// const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const app = express();
const server = http.createServer(app);

const crypto = require("crypto");
const randomId = () => crypto.randomBytes(4).toString("hex");
const name = "customer-bs";
const port = process.env.PORT || 9001;

const customerService = require("./db/customer.service");
const auth = require("./auth");

// app.use(express.json())
app.use(bodyParser.json());

/// enable req.body while http post method.
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  //   res.sendFile(__dirname + '/login.html')
  res.status(200).json({ id: randomId(), message: `${name} is ready!` });
});

app.get("/customer/:userId", async (req, res) => {
  try {
    const {
      params: { userId },
    } = req;
    const resp = await customerService.findOne(userId);

    if (resp.result) {
      res.status(200).json(resp);
    } else {
      res.status(401).json(resp);
    }
  } catch (error) {
    console.log(error);
    const result = {
      status: false,
      message: error.message,
    };
    res.status(401).json(result);
  }
});

app.post("/customer/register", async (req, res) => {
  try {
    // req.body : { userId, email, password }
    const customer = {
      ...req.body,
      password: auth.hashPassword(req.body.password),
    };
    // console.log({customer,pwd: req.body.password , plen:customer.password.length})
    const resp = await customerService.create(customer);
    console.log({ resp });

    if (resp.result) {
      res.status(200).json(resp);
    } else {
      res.status(401).json(resp);
    }
  } catch (error) {
    console.log(error);
    const result = {
      status: false,
      message: error.message,
    };
    res.status(401).json(result);
  }
});

app.post("/customer/login", async (req, res) => {
  try {
    // { userId, password }
    console.log({ body: req.body });
    const { userId, password } = req.body;
    const customer = await customerService.findOne(userId);
    if (!customer) {
      return res.status(401).json({
        status: false,
        message: "not found.",
      });
    }
    console.log(customer);
    if (!auth.verifyPassword(password, customer.password)) {
      console.log({
        one: password,
        two: customer.password,
      });
      return res.status(401).json({
        status: false,
        message: "Authentication failed.",
      });
    }

    const token = auth.generateAccessToken({ userId });

    res.status(200).json({
      status: true,
      message: "good2go",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      status: false,
      message: error.message,
    });
  }
});

app.post("/home", auth.verifyToken, async (req, res) => {
  console.log("sweet home");
  res.status(200).json({
    status: true,
    message: "Home Sweet Home!",
  });
});

server.listen(port, () => {
  console.log(`✅ ${name} listening on *:${port}`);
});
