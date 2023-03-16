

const db = require("../db");
const sirv = require("../sirv");
var fs = require("fs");

exports.getUsernameById = function(req, res, next) {
    try {
        db.query(`SELECT username FROM accounts WHERE user_id='${req.query.user_id}'`, 
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
exports.getUser = function(req, res, next) {
    const query = `
        SELECT *
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
        WHERE wpp_id IN (SELECT UNNEST(wpp_list) FROM collection WHERE user_id = '${req.query.user_id}')
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
exports.changeInfor = function(req, res, next) {
    try {
        let changes = {
            display_name: '',
            username: '',
            bio: '',
            city: '',
            country: ''
        };
        let query = `UPDATE accounts SET`;
        let response;

        // Split changes
        req.body.list_change.forEach(change => {
            changes[change.key] = change.val
        })

        // Set query change in accounts table
        if(changes.display_name.length) {
            query += ` display_name='${changes.display_name}'`
            query += changes.username.length ? `, username='${changes.username}'` : '' 
            query += ` WHERE user_id = '${req.body.user_id}'`
            // Change
            db.query(query, (err, dbres) => {
                if (err) {console.log(err.stack);} 
                // Add response
                else {response = dbres;}
            })
        }
        else if(changes.username.length) {
            query += ` username='${changes.username}'`
            query += ` WHERE user_id = '${req.body.user_id}'`
            // Change
            db.query(query, (err, dbres) => {
                if (err) {console.log(err.stack);} 
                // Add response
                else {response = dbres;}
            })
        }

        // Set query change in user_detail table
        query = `
            UPDATE user_detail SET 
            bio='${changes.bio}',
            location='{"city": "${changes.city}", "country": "${changes.country}"}'::JSONB 
            WHERE user_id = '${req.body.user_id}'
        `;
        db.query(query, (err, dbres) => {
            if (err) {
                console.log(err.stack);
            } else {
                // Add response
                response = dbres;
            }
        })

        // Send response
        res.status(200).json(response);
    }
    catch(err) {
        res.status(500).json({ error: err });
    }
}
exports.updateFollow = function(req, res, next) {
    try {
        let query = `UPDATE user_detail SET follower = array_append(follower, '${req.body.user_id}') where user_id='${req.body.target_id}'`;
        req.body.type === -1 && (query = query.replace('array_append', 'array_remove'));

        let response;
        db.query(query, (err, dbres) => {
            if (err) {
                console.log(err.stack);
            } else {
                response += dbres;
            }
        })
        query = `UPDATE user_detail SET following = array_append(following, '${req.body.target_id}') where user_id='${req.body.user_id}'`;
        req.body.type === -1 && (query = query.replace('array_append', 'array_remove'));

        db.query(query, (err, dbres) => {
            if (err) {
                console.log(err.stack);
            } else {
                response += dbres;
            }
        })
        res.status(200).json(response);
    }
    catch(err) {
        res.status(500).json({ error: err });
    }
}
exports.uploadAvatar = function(req, res, next) {
    const wpp = req.body;
    try {
        // Convert input image file to buffer
        const file = req.file;
        // Read file buffer
        const fileBuffer = fs.readFileSync(file.path);
        // Upload to sirv
        const targetPath = `/swallpapers/user/avt/${file.originalname}`;
        sirv.delete(targetPath);
        const file_detail = sirv.upload(file, fileBuffer, targetPath);
        // Get user detail
        let query = `SELECT user_id, display_name, avatar FROM accounts WHERE username = '${wpp.username}'`
        let user_detail;
        db.query(query, (err, dbres) => {
            if (err) {
                console.log(err.stack);
            } else {
                user_detail = dbres.rows[0];
                let response = '';
                query = `UPDATE accounts SET avatar = '${file_detail.path}' WHERE user_id='${user_detail.user_id}'`
                db.query(query, (err, dbres) => {
                    if (err) {
                        console.log(err.stack);
                    } else {
                        response += dbres;
                    }
                })
                query = `UPDATE wallpapers SET artist_img = '${file_detail.path}' WHERE user_id='${user_detail.user_id}'`
                db.query(query, (err, dbres) => {
                    if (err) {
                        console.log(err.stack);
                    } else {
                        response += dbres;
                    }
                })
                res.status(200).json(response);
            }
        });
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
}