

const db = require("../db");

// Retrieve all Account from the database.
exports.getUser = function(req, res, next) {
    const query = `
        SELECT user_id, username, avatar, display_name, account_type, account_status, createat, following, follower, location
        FROM get_accounts_by_username('${req.query.username}');
    `
    try {
        db.query(query, (err, dbres) => {
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
exports.updateLoveWallpaper = function(req, res, next) {
    const wpp_id = req.body.wpp_id;
    const user_id = req.body.user_id;
    try {
        if(req.body.type === 'love') {
            db.query(`UPDATE wallpapers SET lover = array_append(lover, '${user_id}') WHERE wpp_id = '${wpp_id}'`, 
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
        else if(req.body.type === 'unlove') {
            db.query(`UPDATE wallpapers SET lover = array_remove(lover, '${user_id}') WHERE wpp_id = '${wpp_id}'`, 
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
    }
    catch(err) {
        res.status(500).json({ error: err });
    }
};