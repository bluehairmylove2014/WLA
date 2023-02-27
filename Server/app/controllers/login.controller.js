

const db = require("../db");
const jwt = require('jsonwebtoken');
const fs = require('fs');
const PRIVATE_KEY = fs.readFileSync('private-key.pem');

// Retrieve all Account from the database.
exports.checkLogin = function(req, res, next) {
    try {
        const email = req.body.email;
        const psw = req.body.psw;
        db.query(`SELECT * FROM accounts where email='${email}' and password='${psw}'`, 
            (err, dbres) => {
                if (err) {
                    console.log(err.stack);
                } else {
                    if(dbres.rows.length === 0) {
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
    catch(err) {
        res.status(500).json({ error: err });
    }
}