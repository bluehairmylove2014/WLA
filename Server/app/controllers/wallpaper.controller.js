

const db = require("../db");
const sirv = require("../sirv");
var fs = require("fs");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

exports.upload = function (req, res, next) {
    const wpp = req.body;
    
    try {
        // Convert input image file to buffer
        const file = req.file;
        // Read file buffer
        const fileBuffer = fs.readFileSync(file.path);
        // Upload to sirv
        const targetPath = `/swallpapers/wallpapers/${file.originalname}.${file.mimetype.split('/')[1]}`;
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