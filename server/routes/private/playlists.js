const express = require("express");
const router = express.Router();

const sanitizeHtml = require("sanitize-html");
const pool = require("../../pool.js");
const { minutesToSeconds } = require("../helpers");

/* I think basically all of these need JWT verification */ 

router.get("/:username", async (req, res) => {
    const query = `SELECT *
    FROM playlists p 
    WHERE p.playlist_id IN (SELECT pu.playlist_id FROM playlist_users pu WHERE pu.username = $1)
    LIMIT 20;`;
    const response = await pool.query(query, [req.params.username]);
    if (response.rowCount === 0) {
        res.status(404).send("No playlists belonging to this user");
        return;
    }
    res.send(response.rows);
    return;
});

module.exports = router;