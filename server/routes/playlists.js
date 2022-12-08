const express = require("express");
const router = express.Router();
const private =  require('./private/playlists');

const sanitizeHtml = require("sanitize-html");
const pool = require("../pool.js");
const { minutesToSeconds } = require("./helpers");

router.use('/private', private);

router.post("/create", async (req, res) => {
    // song list is in request body
    const playlistName = sanitizeHtml(req.body.playlist_name);
    const username = sanitizeHtml(req.body.username);
    const description = sanitizeHtml(req.body.description); // needs to be "" in the request if not supplied
    let isPrivate = sanitizeHtml(req.body.isPrivate); // needs to be supplied in request

    if (
        playlistName === "" ||
        username === "" ||
        isPrivate === ""
    ) {
        res.status(400).send("Ensure playlist_name, username, and is_private fields are filled");
        return;
    }

    // make sure user exists
    let query = "SELECT * FROM users WHERE username = $1";
    let response = await pool.query(query, [username]);
    if (response.rowCount == 0) {
        res.status(404).send("User not found");
        return;
    }

    query =
        `INSERT INTO playlists (playlist_name, running_time, last_modified_datetime, description_text, is_private, average_rating) VALUES (\'${playlistName}\', ${0}, \'${new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString()}\', \'${description}\', ${isPrivate}, ${0}) RETURNING playlist_id`;
    response = await pool.query(query);
    let playlist_id = response.rows[0].playlist_id;

    query =
        "INSERT INTO playlist_users (playlist_id, username) VALUES ($1, $2)";
    response = await pool.query(query, [playlist_id, username]);

    if (!response.err) {
        res.send(`${playlist_id}`);
        return;
    }
    res.status(500).send("Error");
});

router.get("/:playlist_id", async (req, res) => {
    const cleanPlaylistId = sanitizeHtml(req.params.playlist_id);
    const tIdSelectResult = await pool.query(
        "SELECT track_id FROM playlist_tracks WHERE playlist_id = $1",
        [cleanPlaylistId]
    );
    if (tIdSelectResult.err) {
        throw tIdSelectResult.err;
    }

    if (tIdSelectResult.rows.length < 1) {
        res.status(404).send("Playlist has no songs or does not exist");
        return;
    }

    let tIdList = [];
    for (let i = 0; i < tIdSelectResult.rows.length; i++) {
        tIdList.push(tIdSelectResult.rows[i].track_id);
    }

    const songsQuery = `SELECT album_id, album_title, artist_id, artist_name, tags, track_date_created, track_date_recorded, track_duration, track_genres, track_number, track_title, track_id FROM tracks WHERE track_id IN (${tIdList.toString()})`;

    const songsResult = await pool.query(songsQuery);
    if (songsResult.rows.length !== 0) {
        res.send(songsResult.rows);
        return;
    } else {
        res.status(404).send(
            "No songs matching the song ID in the playlist were found found (does this track_id exist in tracks table?)"
        );
        return;
    }
});

// add JWT verification here so that a user who isn't the authorized user can't delete playlist
// probs move to private tbh........
router.delete("/:playlist_id", async (req, res) => {
    const cleanPlaylistId = sanitizeHtml(req.params.playlist_id);

    let query = "DELETE FROM playlists WHERE playlist_id = $1";
    const response = await pool.query(query, [cleanPlaylistId]);

    if (response.rowCount === 0) {
        res.status(404).send("No playlist with that ID found to delete");
        return;
    }
    res.send(cleanPlaylistId);
});

router.get("/", async (req, res) => {
    const query = `SELECT *
    FROM playlists
    WHERE is_private = false
    LIMIT 20;`;
    const response = await pool.query(query);
    if (response.rowCount === 0) {
        res.status(404).send("No public playlists in the DB");
        return;
    }
    res.send(response.rows);
    return;
});

module.exports = router;