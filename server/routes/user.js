const express = require("express");
const router = express.Router();

const passport = require("passport");
const sanitizeHtml = require("sanitize-html");
const pool = require("../pool.js");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

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
        const query =
            'INSERT INTO "users" (username, password, email_address) VALUES ($1, $2, $3)';
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

/**
 * JWT:
 * - base64 encoded
 * takes form: "[header].[payload].[verifysignature]"
 * header:
 *  algorithm, type of token 
 * payload:
 *  bunch of stuff (sub, name, iat, etc.)
 * verifysignature: (kinda like a checksum with hashing -> called Hash-based Message Authentication Code (HMAC))
 *  HMACSHA256(
        base64UrlEncode(header) + "." +
        base64UrlEncode(payload),
        256-bit-secret
    )
 */

// we need our payload to be {email, username} so the client side can use it
// to send to the api
router.post("/login", async (req, res) => {
    const email_address_in = sanitizeHtml(req.body.email_address);
    const password = sanitizeHtml(req.body.password);

    if (email_address_in === "" || password === "") {
        res.status(400).send("Ensure all fields are filled.");
        return;
    }

    try {
        const query =
            'SELECT username, password, is_activated FROM "users" WHERE email_address = $1';
        const result = await pool.query(query, [email_address_in]);
        if (result.rowCount == 1) {
            if (result.rows[0].is_activated === false) {
                res.status(403).send(
                    "Account deactivated. Please message admin at admin@basmusic.com"
                );
                return;
            }

            if (await argon2.verify(result.rows[0].password, password)) {
                const jwToken = jwt.sign(
                    {
                        email_address: email_address_in,
                        username: result.rows[0].username,
                    },
                    process.env.JWT_SECRET
                );
                res.send({ message: "success", token: jwToken });
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

router.post(
    "/change_password",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const password = req.body.old_password;
        const new_p = req.body.new_password;
        const email = req.user.email_address;

        if (password === "" || new_p === "") {
            res.status(400).send("Ensure all fields are filled.");
            return;
        }

        try {
            const old_p = await pool.query(
                'SELECT password FROM "users" WHERE email_address = $1',
                [email]
            );
            if (old_p.rowCount == 1) {
                if (await argon2.verify(old_p.rows[0].password, password)) {
                    const query =
                        'UPDATE "users" SET password = $1 WHERE email_address = $2';
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
    }
);

module.exports = router;
