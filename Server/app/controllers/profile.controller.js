

const db = require("../db");

// Retrieve all Account from the database.
exports.getAll = function(req, res, next) {
    try {
        db.query(`SELECT * FROM accounts`, (err, dbres) => {
            if (err) {
                console.log(err.stack);
            } else {
                res.status(200).json(dbres.rows);
            }
        })
    }
    catch(err) {
        res.status(500).json({ error: err });
    }
}
exports.getUser = function(req, res, next) {
    try {
        db.query(`SELECT * FROM get_accounts_by_username('${req.query.username}')`, (err, dbres) => {
            if (err) {
                console.log(err.stack);
            } else {
                res.status(200).json(dbres.rows);
            }
        })
    }
    catch(err) {
        res.status(500).json({ error: err });
    }
}
exports.getWallpapers = function(req, res, next) {
    try {
        db.query(`SELECT * FROM wallpapers WHERE user_id='${req.query.user_id}' ORDER BY wpp_id ASC`, 
            (err, dbres) => {
                if (err) {
                    console.log(err.stack);
                } else {
                    res.status(200).json(dbres.rows);
                }
            }
        )
    }
    catch(err) {
        res.status(500).json({ error: err });
    }
}
exports.getAlbums = function(req, res, next) {
    try {
        db.query(`SELECT * FROM albums WHERE user_id='${req.query.user_id}' ORDER BY album_id ASC`, 
            (err, dbres) => {
                if (err) {
                    console.log(err.stack);
                } else {
                    res.status(200).json(dbres.rows);
                }
            }
        )
    }
    catch(err) {
        res.status(500).json({ error: err });
    }
}
exports.increaseDownloadWallpaper = function(req, res, next) {
    const wpp_id = req.body.wpp_id;
    try {
        db.query(`UPDATE wallpapers SET total_download = total_download + 1 WHERE wpp_id = '${wpp_id}'`, 
            (err, dbres) => {
                if (err) {
                    console.log(err.stack);
                }
                else {
                    res.status(200).json(dbres.rows);
                }
            }
        )
    }
    catch(err) {
        res.status(500).json({ error: err });
    }
};
exports.increaseLoveWallpaper = function(req, res, next) {
    const wpp_id = req.body.wpp_id;
    try {
        db.query(`UPDATE wallpapers SET total_love = total_love + 1 WHERE wpp_id = '${wpp_id}'`, 
            (err, dbres) => {
                if (err) {
                    console.log(err.stack);
                }
                else {
                    res.status(200).json(dbres.rows);
                }
            }
        )
    }
    catch(err) {
        res.status(500).json({ error: err });
    }
};
exports.decreaseLoveWallpaper = function(req, res, next) {
    const wpp_id = req.body.wpp_id;
    try {
        db.query(`UPDATE wallpapers SET total_love = total_love - 1 WHERE wpp_id = '${wpp_id}'`, 
            (err, dbres) => {
                if (err) {
                    console.log(err.stack);
                }
                else {
                    res.status(200).json(dbres.rows);
                }
            }
        )
    }
    catch(err) {
        res.status(500).json({ error: err });
    }
};