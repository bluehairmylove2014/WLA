const express = require("express");
const router = express.Router();

const {
    getUser,
    getWallpapers,
    getAlbums,
    getCollection,
} = require("../controllers/profile.controller");

router.get("/getCollection", getCollection);
router.get("/getAlbums", getAlbums);
router.get("/getWallpapers", getWallpapers);
router.get("/getUser", getUser);

module.exports = router;