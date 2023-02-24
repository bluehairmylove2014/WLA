

const db = require("../db");

// Retrieve all Account from the database.
exports.checkLogin = function(req, res, next) {
    try {
        const email = req.query.email;
        const psw = req.query.psw;
        db.query(`SELECT * FROM accounts where email='${email}' and password='${psw}'`, 
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