const express = require("express");
const router = express.Router();

const {
    checkLogin,
    createUser,
    loginWithGoogle
} = require("../controllers/login.controller");

router.get("/loginWithGoogle", loginWithGoogle);
router.post("/createUser", createUser);
router.post("/checkLogin", checkLogin);

module.exports = router;