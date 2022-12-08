const express = require("express");
const router = express.Router();

const sanitizeHtml = require("sanitize-html");
const pool = require("../pool.js");
const argon2 = require("argon2");

router.get("/:artist_id", (req, res) => {
    const cleanArtistId = sanitizeHtml(req.params.artist_id);

    // find the row for the matching artist in the DB
    pool.query(
        "SELECT * FROM artists WHERE artist_id = $1",
        [cleanArtistId],
        (err, resp) => {
            if (err) {
                // TODO: handle it if artist_id doesnt exist
                throw err;
            }

            if (resp.rows.length == 0) {
                res.status(404).send("No results found");
                return;
            }

            // assemble JSON object with the attributes which are not null
            const obj = new Object();
            obj.artist_comments = resp.rows[0].artist_comments;
            obj.artist_date_created = resp.rows[0].artist_date_created;
            obj.artist_favorites = resp.rows[0].artist_favorites;
            obj.artist_handle = resp.rows[0].artist_handle;
            obj.artist_image_file = resp.rows[0].artist_image_file;
            obj.artist_name = resp.rows[0].artist_name;

            res.send(obj);
        }
    );
});

router.get("/", (req, res) => {
    const cleanQuery = sanitizeHtml(req.query.search);

    if (cleanQuery == "") {
        res.status(400).send("Enter a search query");
        return;
    }

    let sqlStr =
        "SELECT DISTINCT artist_id FROM artists WHERE artist_name LIKE '%" +
        cleanQuery +
        "%'";
    pool.query(sqlStr, (err, resp) => {
        if (err) {
            throw err;
        }
        if (resp.rows.length == 0) {
            res.status(404).send("No results found.");
            return;
        } else {
            res.send(resp.rows);
            return;
        }
    });
});

module.exports = router;
