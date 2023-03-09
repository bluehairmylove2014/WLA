const express = require("express");
const router = express.Router();

const {
    searchFor,
} = require("../controllers/search.controller");

router.get("/searchFor", searchFor);

module.exports = router;