

const db = require("../db");

exports.searchFor = function (req, res, next) {
    const type_search = req.query.type;
    let key_search_origin = req.query.key.toLowerCase();
    let key_search_split = key_search_origin.split(' ');

    try {
        switch (type_search) {
            case 'photos': {
                let query = `SELECT * FROM wallpapers WHERE wpp_type ILIKE '%image%' AND (`;

                key_search_split.forEach((key, index) => {
                    if (index > 0) {
                        query += ` OR `;
                    }
                    query += `lower(wpp_tags) ILIKE '%${key}%'`;
                });

                query += `)`;
                db.query(query, (err, dbres) => {
                    if (err) {
                        console.log(err.stack);
                    } else {
                        res.status(200).json(dbres.rows);
                    }
                });
                break;
            }
            case 'videos': {
                let query = `SELECT * FROM wallpapers WHERE wpp_type ILIKE '%video%' AND (`;

                key_search_split.forEach((key, index) => {
                    if (index > 0) {
                        query += ` OR `;
                    }
                    query += `lower(wpp_tags) ILIKE '%${key}%'`;
                });

                query += `)`;

                db.query(query, (err, dbres) => {
                    if (err) {
                        console.log(err.stack);
                    } else {
                        res.status(200).json(dbres.rows);
                    }
                });
                break;
            }
            case 'users': {
                let query = `SELECT * FROM accounts WHERE (`;

                key_search_split.forEach((key, index) => {
                    if (index > 0) {
                        query += ` OR `;
                    }
                    query += `lower(display_name) ILIKE '%${key}%'`;
                });

                query += `)`;
                db.query(query, (err, dbres) => {
                    if (err) {
                        console.log(err.stack);
                    } else {
                        res.status(200).json(dbres.rows);
                    }
                });
                break;
            }
            default: {
                res.status(400).json('Type is not supported');
                break;
            }
        }
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
}