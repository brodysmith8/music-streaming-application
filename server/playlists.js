'use strict'

/* Requirement 6: Create new playlist */
exports.create = async function (req, res) {
    // song list is in request body
    const playlistName = sanitizeHtml(req.body.playlist_name);
    const username = sanitizeHtml(req.body.username);
    const description = sanitizeHtml(req.body.description); // needs to be "" in the request if not supplied
    let isPrivate = sanitizeHtml(req.body.isPrivate); // needs to be supplied in request 

    let query = "INSERT INTO playlists (playlist_name, running_time, last_modified_datetime, description_text, is_private, average_rating) VALUES ($1, 0, $2, $3, $4, 0.0)";
    let response = await pool.query(query, [playlistName, new Date(), description, isPrivate]);

    query = "INSERT INTO playlist_users (username) VALUES ($1)";
    response = await pool.query(query, [username]);
    if (!response.rows[0]) {
        res.send(playlistName);
        return;
    }

    res.status(409).send("Conflict happened");
}

/* Requirement 7: Add songs to playlist
   make sure playlist exists before calling this... */
exports.add_songs = async function (req, res) {
    const songList = sanitizeHtml(req.body.track_list).split(',');
    const playlistName = sanitizeHtml(req.body.playlist_name);
    const username = sanitizeHtml(req.body.username);
    const cleanPlaylistId = sanitizeHtml(req.params.playlist_id);

    // DB assumption: user can only have distinct songs in a playlist; no repeats
    let query1 = "INSERT INTO playlist_tracks (playlist_id, track_id) VALUES ";
    let query2 = "SELECT track_duration FROM tracks WHERE track_id IN (";
    for (let i = 0; i < songList.length; i++) {
        if (i != 0) {
            query1 += ',';
            query2 += ','
        }
        query1 += `(${cleanPlaylistId}, ${songList[i]})`;
        query2 += `${songList[i]}`;
    }
    query2 += ')';

    let responseAddition;
    try {
        responseAddition = await pool.query(query1);
    } catch (err) {
        console.log("Err: " + err);
        res.status(409).send("No duplicate songs...");
        return;
    }

    let responseRts;
    try {
        responseRts = await pool.query(query2);
    } catch (err) {
        console.log("Err: " + err);
        res.send("Couldnt get track times");
        return;
    }

    let s = 0;
    for (let i = 0; i < responseRts.rowCount; i++) {
        s += minutesToSeconds(responseRts.rows[i].track_duration);
    }

    let query = "UPDATE playlists SET running_time = $1 WHERE playlist_id = $2"
    let response = await pool.query(query, [s, cleanPlaylistId]);
    res.send(cleanPlaylistId);
}

/* Requirement 8: Get track_ids for all songs in playlist */
exports.get_track_ids_for_playlist = function (req, res) {
    const cleanPlaylistId = sanitizeHtml(req.params.playlist_id);
    pool.query('SELECT track_id FROM playlist_tracks WHERE playlist_id = $1', [cleanPlaylistId], (err, resp) => {
        if (err) {
            throw err;
        }

        if (resp.rows.length < 1) {
            res.status(404).send('Playlist has no songs');
            return;
        } else {
            let justValues = new Array();
            for (let i = 0; i < resp.rows.length; i++) {
                justValues[i] = resp.rows[i].track_id;
            }

            res.send(justValues);
        }
    });
}

/* Requirement 9: Delete playlist */
exports.delete_playlist = function (req, res) {
    const cleanPlaylistId = sanitizeHtml(req.params.playlist_id);

    let query = "DELETE FROM playlists WHERE playlist_id = $1"
    let response;
    try {
        response = pool.query(query, [cleanPlaylistId]);
    } catch (err) {
        console.log("err: " + err);
        res.status(404).send("Playlist not found");
        return ;
    }
    console.log(response.rows);
    res.send(cleanPlaylistId);
}

/* Requirement 10: Get playlist information */
exports.get_playlist_information = function (req, res) {
    // todo
}