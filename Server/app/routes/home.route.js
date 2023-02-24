const express = require("express");
const router = express.Router();

const {
    checkLogin
} = require("../controllers/home.controller");

router.get("/checkLogin", checkLogin);

module.exports = router;