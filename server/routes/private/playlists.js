const express = require("express");
const router = express.Router();

const passport = require("passport");
const sanitizeHtml = require("sanitize-html");
const pool = require("../../pool.js");
const { minutesToSeconds } = require("../helpers");

/* I think basically all of these need JWT verification */

router.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const query = `SELECT *
    FROM playlists p 
    WHERE p.playlist_id IN (SELECT pu.playlist_id FROM playlist_users pu WHERE pu.username = $1)
    LIMIT 20;`;
    const response = await pool.query(query, [req.user.username]);
    if (response.rowCount === 0) {
        res.status(404).send("No playlists belonging to this user");
        return;
    }
    res.send(response.rows);
    return;
});

router.put("/:playlist_id", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const songList = sanitizeHtml(req.body.track_list).split(",");
    const playlistId = sanitizeHtml(req.params.playlist_id);

    const username = req.user.username;

    // if playlist exists and does not belong to user, kill em
    const userResult = await pool.query("SELECT playlist_id FROM playlist_users WHERE username != $1 AND playlist_id = $2", [req.user.username, playlistId]);
    if (userResult.rowCount > 0) {
        res.status(401).send("No playlist found with your username and that playlist_id");
        return;
    }

    /** steps:
     * 1. validate input
     * 2. make sure playlist exists
     * 3. insert (p_id, t_id) into p_tracks
     * 4. get track duration
     * 5. convert track durations to seconds
     * 6. set running_time for that specific playlist
     */

    /* Add playlist to DB if it doesn't already exist */
    let query = `INSERT INTO playlists OVERRIDING SYSTEM VALUE VALUES (17, 'playlist', 0, '2022-12-03T11:21:43.446-05:00', 'ab', false, 0) ON CONFLICT DO NOTHING RETURNING playlist_id;
                   SELECT setval('playlists_playlist_id_seq', (SELECT MAX(playlist_id) from playlists));
    `;
    const additionResponse = await pool.query(query);

    if (additionResponse[0].rowCount === 1) {
        query = `INSERT INTO playlist_users VALUES ($1, $2);`;
        const r = pool.query(query, [playlistId, username]);
    }

    // basically just delete all songs
    if (songList[0] === "") {
        query = `DELETE FROM playlist_tracks WHERE playlist_id = ${playlistId}`;
        await pool.query(query);
        res.send(playlistId);
        return;
    }

    /* Delete the songs in the playlist that have been removed */
    query = `DELETE FROM playlist_tracks WHERE playlist_id = ${playlistId} AND track_id NOT IN (${songList.toString()})`;
    const deletionResponse = await pool.query(query);

    /* Add list of songs */
    let endStr = `(${playlistId}, ${songList[0]})`;
    for (let i = 1; i < songList.length; i++) {
        endStr += `, (${playlistId}, ${songList[i]})`;
    }

    query = `INSERT INTO playlist_tracks VALUES ${endStr} ON CONFLICT DO NOTHING`;
    const pTracksResponse = await pool.query(query);

    /* Update running time/description/privacy/name */
    query = `SELECT track_duration FROM tracks WHERE track_id IN (${songList.toString()})`;
    const trackTimesResponse = await pool.query(query);
    let sum = 0;
    for (let i = 0; i < trackTimesResponse.rowCount; i++) {
        sum += minutesToSeconds(trackTimesResponse.rows[i].track_duration);
    }
    query = `UPDATE playlists SET playlist_name = \'${req.body.playlist_name}\', 
                                    running_time = ${sum}, 
                                    last_modified_datetime = \'${new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString()}\',
                                    description_text = \'${req.body.description}\', 
                                    is_private = ${req.body.is_private} 
                                    WHERE playlist_id = ${playlistId}`;
    const updateResponse = await pool.query(query);

    /* Send responses if all is successful */
    res.send(playlistId);
});

module.exports = router;
