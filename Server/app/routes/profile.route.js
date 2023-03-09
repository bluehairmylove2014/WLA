const express = require("express");
const router = express.Router();

const {
    getUser,
    getWallpapers,
    getAlbums,
    getCollection,
    getUsernameById
} = require("../controllers/profile.controller");

router.get("/getUsernameById", getUsernameById);
router.get("/getCollection", getCollection);
router.get("/getAlbums", getAlbums);
router.get("/getWallpapers", getWallpapers);
router.get("/getUser", getUser);

module.exports = router;