const express = require("express");
const router = express.Router();
const multer = require('multer');
const uploada = multer({ dest: 'avatar/' });

const {
    getUser,
    getWallpapers,
    getAlbums,
    getCollection,
    getUsernameById,
    updateFollow,
    changeInfor,
    uploadAvatar
} = require("../controllers/profile.controller");

router.put("/changeInfor", changeInfor);
router.post("/uploadAvatar", uploada.single('file'), uploadAvatar);
router.put("/updateFollow", updateFollow);
router.get("/getUsernameById", getUsernameById);
router.get("/getCollection", getCollection);
router.get("/getAlbums", getAlbums);
router.get("/getWallpapers", getWallpapers);
router.get("/getUser", getUser);

module.exports = router;