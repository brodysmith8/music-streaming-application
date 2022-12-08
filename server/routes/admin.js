const express = require("express");
const router = express.Router();

const passport = require("passport");
const sanitizeHtml = require("sanitize-html");
const pool = require("../pool.js");

// grant admin
router.put(
    "/user/give_admin/:username",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        if (req.user.username !== "administrator") {
            res.status(403).send("Administrator only");
            return;
        }

        // grant admin
        let query = `UPDATE \"users\" SET is_admin = ${req.body.admin_status} WHERE username = \'${req.params.username}\'`;
        console.log(query);
        const resp = await pool.query(query);

        res.send(req.params.username);
    }
);

router.put(
    "/user/verify/:username",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        if (req.user.username !== "administrator") {
            res.status(403).send("Administrator only");
            return;
        }

        // set verified or not
        let query = `UPDATE users SET is_verified = ${req.body.verification_status} WHERE username = \'${req.params.username}\'`;
        const resp = await pool.query(query);

        res.send(req.params.username);
    }
);

router.put(
    "/user/activate/:username",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        if (req.user.username !== "administrator") {
            res.status(403).send("Administrator only");
            return;
        }

        // set activated or not
        let query = `UPDATE \"users\" SET is_activated = ${req.body.activation_status} WHERE username = \'${req.params.username}\'`;
        const resp = await pool.query(query);

        res.send(req.params.username);
    }
);

router.put(
    "/review/:review_id",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        if (req.user.username !== "administrator") {
            res.status(403).send("Administrator only");
            return;
        }

        // set hidden or not
        const query = `UPDATE reviews SET is_hidden=${
            req.body.hidden
        } WHERE review_id = ${sanitizeHtml(req.params.review_id)}`;
        const qResp = await pool.query(query);
        res.send(`${req.params.review_id}`);
        return;
    }
);

router.get(
    "/user/:username",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        if (req.user.username !== "administrator") {
            res.status(403).send("Administrator only");
            return;
        }

        // set activated or not
        let query = `SELECT * FROM \"users\" WHERE username = \'${req.params.username}\'`;
        const resp = await pool.query(query);

        res.send(resp.rows[0]);
    }
);

module.exports = router;
