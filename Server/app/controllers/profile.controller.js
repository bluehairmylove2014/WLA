

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
exports.getCollection = function(req, res, next) {
    const query = `
        SELECT *
        FROM wallpapers
        WHERE user_id = '${req.query.user_id}'
        AND wpp_id IN (SELECT UNNEST(wpp_list) FROM collection WHERE user_id = '${req.query.user_id}')
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