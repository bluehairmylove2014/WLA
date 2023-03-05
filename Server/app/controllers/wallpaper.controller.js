

const db = require("../db");
const sirv = require("../sirv");
var fs = require("fs");

exports.upload = function (req, res, next) {
    const wpp = req.body;

    try {
        // Convert input image file to buffer
        const file = req.file;
        // Read file buffer
        const fileBuffer = fs.readFileSync(file.path);
        // Upload to sirv
        const targetPath = `/swallpapers/wallpapers/${file.originalname}`;
        const file_detail = sirv.upload(file, fileBuffer, targetPath);

        // Get user detail
        let query = `SELECT user_id, display_name, avatar FROM accounts WHERE username = '${wpp.username}'`
        let user_detail;
        db.query(query, (err, dbres) => {
            if (err) {
                console.log(err.stack);
            } else {
                user_detail = dbres.rows[0];
                query = `
                    INSERT INTO wallpapers 
                    (user_id, artist_name, artist_img, wpp_path, total_views, lover, total_download, wpp_type)
                    VALUES
                    (
                        '${user_detail.user_id}', 
                        '${user_detail.display_name}' , 
                        '${user_detail.avatar}', 
                        '${file_detail.path}', 
                        0, 
                        ARRAY[]::INT[], 
                        0, 
                        '${file_detail.type}'
                    );
                `
                db.query(query, (err, dbres) => {
                    if (err) {
                        console.log(err.stack);
                    } else {
                        res.status(200).json(dbres.rows);
                    }
                })
            }
        });
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
}
exports.download = function (req, res, next) {
    let filename = `%2Fswallpapers%2Fwallpapers%2F${req.query.filename}`;
    try {
        // Download from sirv
        sirv.download(filename)
            .then(file => {
                db.query(`UPDATE wallpapers SET total_download = total_download + 1 WHERE wpp_id = '${req.query.wpp_id}'`,
                    (err, dbres) => {
                        if (err) {
                            console.log(err.stack);
                        }
                        else {
                            // console.log(dbres);
                        }
                    }
                )
                res.status(200).json(file);
            })
            .catch(error => {
                console.log(`Error download file: ${error}`);
            });
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
}
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
exports.updateSaveWallpaper = function(req, res, next) {
    const data_pkg = req.body;
    try {
        if(data_pkg.type === 'save') {
            db.query(`UPDATE collection SET wpp_list = array_append(wpp_list, '${data_pkg.wpp_id}') WHERE user_id = '${data_pkg.user_id}'`, 
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
        else if(data_pkg.type === 'unsave') {
            db.query(`UPDATE collection SET wpp_list = array_remove(wpp_list, '${data_pkg.wpp_id}') WHERE user_id = '${data_pkg.user_id}'`, 
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
exports.getSpotlightWallpaper = function(req, res, next) {
    let start_index = req.query.start >= 0 ? req.query.start : 0;
    let numof_wallpaper = req.query.numof_wallpaper >= 0 ? req.query.numof_wallpaper : 0;
    const query = `
        SELECT *
        FROM wallpapers
        ORDER BY total_download DESC, wpp_id ASC
        OFFSET ${start_index}
        LIMIT ${numof_wallpaper};    
    `
    try {
        if(numof_wallpaper) {
            db.query(query, (err, dbres) => {
                    if (err) {
                        console.log(err.stack);
                    }
                    else {
                        res.status(200).json({
                            wpps: dbres.rows,
                            total: dbres.rows.length ? dbres.rows.length : 0
                        });
                    }
                }
            )  
        }
    }
    catch(err) {
        res.status(500).json({ error: err });
    }
};