const express = require("express");
const router = express.Router();

const {
    getUser,
    getWallpapers,
    getAlbums,
    increaseDownloadWallpaper,
    updateLoveWallpaper
} = require("../controllers/profile.controller");

router.get("/getAlbums", getAlbums);
router.get("/getWallpapers", getWallpapers);
router.get("/getUser", getUser);
router.put("/increaseDownloadWallpaper", increaseDownloadWallpaper);
router.put("/updateLoveWallpaper", updateLoveWallpaper);

module.exports = router;