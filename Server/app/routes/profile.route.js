const express = require("express");
const router = express.Router();

const {
    getAll,
    getUser,
    getWallpapers,
    getAlbums,
    increaseDownloadWallpaper,
    increaseLoveWallpaper,
    decreaseLoveWallpaper
} = require("../controllers/profile.controller");

router.get("/getAlbums", getAlbums);
router.get("/getWallpapers", getWallpapers);
router.get("/getAll", getAll);
router.get("/getUser", getUser);
router.put("/increaseDownloadWallpaper", increaseDownloadWallpaper);
router.put("/increaseLoveWallpaper", increaseLoveWallpaper);
router.put("/decreaseLoveWallpaper", decreaseLoveWallpaper);

module.exports = router;