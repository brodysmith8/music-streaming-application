'use strict'

exports.create = async function (req, res) {
    let hash;
    const email = req.body.email_address;
    const username = req.body.username;
    const password = req.body.password;

    try {
        hash = await argon2.hash(password);
        const query = "INSERT INTO \"users\" (username, password, email_address) VALUES ($1, $2, $3)";
        const result = await pool.query(query, [username, hash, email]);
        if (result.rowCount == 1) {
            res.send(username);
        } else {
            res.send("User not created")
        }
    } catch (err) {
        console.log("Err: " + err);
        if (err.message.search("duplicate") != -1) {
            res.status(409).send("Username taken")
        }
    }
}

exports.login = async function (req, res) {
    const username = req.body.username;
    const password = req.body.old_password;
    const new_p = req.body.new_password;
    const email = req.body.email_address;

    try {
        const old_p = await pool.query("SELECT password FROM \"users\" WHERE (username = $1 OR email_address = $2)", [username, email])
        if (old_p.rowCount == 1) {
            console.log("abc: " + old_p.rows[0].password);
            if (argon2.verify(old_p.rows[0].password, password)) {
                const query = "UPDATE \"users\" SET password = $1 WHERE (username = $2 OR email_address = $3)";
                const hash = await argon2.hash(new_p);
                const response = await pool.query(query, [hash, username, email]);
                if (response.rowCount == 1) {
                    res.send("successful");
                }
            } else {
                res.send("old password incorrect");
            }
        } else {
            res.send("user not found");
        }
    } catch (err) {
        console.log("err: " + err);
    }
}

exports.change_password = async function (req, res) {
    const username = req.body.username;
    const password = req.body.old_password;
    const new_p = req.body.new_password;
    const email = req.body.email_address;

    try {
        const old_p = await pool.query("SELECT password FROM \"users\" WHERE (username = $1 OR email_address = $2)", [username, email])
        if (old_p.rowCount == 1) {
            console.log("abc: " + old_p.rows[0].password);
            if (argon2.verify(old_p.rows[0].password, password)) {
                const query = "UPDATE \"users\" SET password = $1 WHERE (username = $2 OR email_address = $3)";
                const hash = await argon2.hash(new_p);
                const response = await pool.query(query, [hash, username, email]);
                if (response.rowCount == 1) {
                    res.send("successful");
                }
            } else {
                res.send("old password incorrect");
            }
        } else {
            res.send("user not found");
        }
    } catch (err) {
        console.log("err: " + err);
    }
}