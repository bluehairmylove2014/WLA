const express = require("express");
const router = express.Router();
const multer = require('multer');
const uploada = multer({ dest: 'uploads/' });
const {
    upload
} = require("../controllers/wallpaper.controller");

// router.post("/upload", upload);
router.post("/upload", uploada.single('file'), upload);

module.exports = router;