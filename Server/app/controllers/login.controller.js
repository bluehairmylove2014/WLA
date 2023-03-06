

const db = require("../db");
const jwt = require('jsonwebtoken');
const fs = require('fs');
const PRIVATE_KEY = fs.readFileSync('./private-key.pem');
// console.log(__dirname);
exports.checkLogin = function (req, res, next) {
    try {
        const email = req.body.email;
        const psw = req.body.psw;
        db.query(`SELECT * FROM accounts where email='${email}' and password='${psw}'`,
            (err, dbres) => {
                if (err) {
                    console.log(err.stack);
                } else {
                    if (dbres.rows.length === 0) {
                        // Wrong
                        res.status(401);
                    }
                    else {
                        // Valid login
                        const jwtBearerToken = jwt.sign({}, PRIVATE_KEY, {
                            algorithm: 'RS256',
                            // Add to set expire time  
                            expiresIn: 200,
                            subject: dbres.rows[0].username
                        })
                        res.status(200).json({ idToken: jwtBearerToken, expiresIn: 120 });
                    }
                }
            }
        )
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
}
exports.loginWithGoogle = function(req, res, next) {
    try {
        const email = req.query.email;
        db.query(`SELECT * FROM accounts where email='${email}'`,
            (err, dbres) => {
                if (err) {
                    console.log(err.stack);
                } else {
                    if (dbres.rows.length === 0) {
                        // Wrong
                        res.status(401);
                    }
                    else {
                        // Valid login
                        const jwtBearerToken = jwt.sign({}, PRIVATE_KEY, {
                            algorithm: 'RS256',
                            // Add to set expire time  
                            expiresIn: 200,
                            subject: dbres.rows[0].username
                        })
                        res.status(200).json({ idToken: jwtBearerToken, expiresIn: 120 });
                    }
                }
            }
        )
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
}
exports.createUser = function (req, res, next) {
    try {
        const email = req.body.email;
        const fullname = req.body.fullname;
        const avatar = req.body.avatar;
        const password = req.body.password;
        // Get the max user_id
        let query = 'SELECT MAX(user_id) as LAST_ID FROM accounts';
        db.query(query, (err, dbres) => {
            if (err) {
                console.log(err.stack);
            } else {
                const max_id = dbres.rows[0].last_id?.split('@');
                if(max_id) {
                    const new_id = max_id[0] + '@' + (Number.parseInt(max_id[1]) + 1);
                    // Create user
                    query = `
                        INSERT INTO accounts 
                        (user_id, username, password, email, avatar, display_name, account_type, account_status)
                        VALUES
                        ('${new_id}', '${email.split('@')[0]}', '${password}', '${email}', '${avatar}', '${fullname}', 'user', 'normal')
                    `
                    db.query(query, (err, dbres) => {
                        if (err) {
                            console.log(err.stack);
                        } else {
                            query = `
                                INSERT INTO user_detail 
                                (user_id, following, follower, location)
                                VALUES
                                ('${new_id}', ARRAY[]::TEXT[], ARRAY[]::TEXT[], '{"city": "", "country": ""}'::JSONB)
                            `
                            db.query(query, (err, dbres) => {
                                if (err) {
                                    console.log(err.stack);
                                } else {
                                    query = `
                                        INSERT INTO collection 
                                        (user_id, wpp_list)
                                        VALUES
                                        ('${new_id}', ARRAY[]::INT[])
                                    `
                                    db.query(query, (err, dbres) => {
                                        if (err) {
                                            console.log(err.stack);
                                        } else {
                                            // Valid login
                                            const jwtBearerToken = jwt.sign({}, PRIVATE_KEY, {
                                                algorithm: 'RS256',
                                                // Add to set expire time  
                                                expiresIn: 200,
                                                subject: email.split('@')[0]
                                            })
                                            res.status(200).json({ idToken: jwtBearerToken, expiresIn: 120 });
                                        }
                                    })
                                }
                            });
                        }
                    })
                }
            }
        })
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
}