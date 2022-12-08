const express = require("express");
const router = express.Router();

const passport = require("passport");
const sanitizeHtml = require("sanitize-html");
const pool = require("../pool.js");

router.put(
    "/user/:username",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        if (req.user.username !== "admin") {
            res.status(403).send("Administrator only");
            return;
        }

        // grant admin

        // set verified or not

        // set activated or not
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
        const query = `UPDATE reviews SET is_hidden=${req.body.hidden} WHERE review_id = ${sanitizeHtml(req.params.review_id)}`;
        const qResp = await pool.query(query);
        res.send(`${req.params.review_id}`);
        return;
    }
);

module.exports = router;
