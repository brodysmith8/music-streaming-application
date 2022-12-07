const express = require("express");
const router = express.Router();

const pool = require("../pool.js");
const argon2 = require('argon2');

router.post("/create", async (req, res) => {
    let hash;
    const email = req.body.email_address;
    const username = req.body.username;
    const password = req.body.password;

    if (email === "" || username === "" || password === "") {
        res.status(400).send("Ensure all fields are filled.");
        return;
    }

    try {
        hash = await argon2.hash(password);
        const query = "INSERT INTO \"users\" (username, password, email_address) VALUES ($1, $2, $3)";
        const result = await pool.query(query, [username, hash, email]);
        if (result.rowCount == 1) {
            res.send(username);
        } else {
            res.send("User not created");
        }
    } catch (err) {
        console.log("Err: " + err);
        if (err.message.search("duplicate") != -1) {
            res.status(409).send("Username taken");
            return;
        }
        res.status(500).send("Error");
        return;
    }
});

router.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username === "" || password === "") {
        res.status(400).send("Ensure all fields are filled.");
        return;
    }

    try {
        const query = "SELECT password FROM \"users\" WHERE (username = $1)"
        const result = await pool.query(query, [username]);
        if (result.rowCount == 1) {
            if (await argon2.verify(result.rows[0].password, password)) {
                res.send("success");
                return;
            } else {
                res.status(401).send("password incorrect");
                return;
            }
        } else {
            res.status(404).send("Account not found");
            return;
        }
    } catch (err) {
        console.log("Err: " + err);
        res.status(500).send("Error");
        return;
    }
});

router.post("/change_password", async (req, res) => {
    const password = req.body.old_password;
    const new_p = req.body.new_password;
    const email = req.body.email_address;

    if (password === "" || new_p === "" || email === "") {
        res.status(400).send("Ensure all fields are filled.");
        return;
    }

    try {
        const old_p = await pool.query("SELECT password FROM \"users\" WHERE email_address = $1", [email])
        if (old_p.rowCount == 1) {
            if (await argon2.verify(old_p.rows[0].password, password)) {
                const query = "UPDATE \"users\" SET password = $1 WHERE email_address = $2";
                const hash = await argon2.hash(new_p);
                const response = await pool.query(query, [hash, email]);
                if (response.rowCount == 1) {
                    res.send("successful");
                    return;
                }
            } else {
                res.status(401).send("old password incorrect");
                return;
            }
        } else {
            res.status(404).send("user not found");
            return;
        }
    } catch (err) {
        console.log("err: " + err);
        res.status(500).send("error");
        return;
    }
});

module.exports = router;