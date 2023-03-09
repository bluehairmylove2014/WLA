const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');

const app = express();


app.use(bodyParser.json());

app.use(express.json());

const corsOptions = { origin: false };
app.use(cors(corsOptions));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS,PATCH");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Cookie, Authorization"
  );
  next();
});

// use router - index.js
const route = require("./app/routes")
route(app);

module.exports = app;