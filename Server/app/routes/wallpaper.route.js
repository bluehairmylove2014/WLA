const express = require("express");
const router = express.Router();
const multer = require('multer');
const uploada = multer({ dest: 'uploads/' });
const {
    upload,
    download,
    updateLoveWallpaper,
    updateSaveWallpaper,
    getSpotlightWallpaper
} = require("../controllers/wallpaper.controller");

router.get("/getSpotlightWallpaper", getSpotlightWallpaper);
router.get("/download", download);
router.post("/upload", uploada.single('file'), upload);
router.put("/updateLoveWallpaper", updateLoveWallpaper);
router.put("/updateSaveWallpaper", updateSaveWallpaper);

module.exports = router;