const express = require("express");
const router = express.Router();

const {
    checkLogin
} = require("../controllers/login.controller");

router.post("/checkLogin", checkLogin);

module.exports = router;