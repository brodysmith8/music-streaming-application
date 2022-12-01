"use strict";

// this script is a service-side script. It runs on the AWS machine. 
// Thus, we may use localhost to connect to the API.  

const { application } = require('express');
const express = require('express');
const cors = require('cors');
const sanitizeHtml = require('sanitize-html');
const { Pool } = require('pg');
const argon2 = require('argon2');
// const { auth } = require('express-openid-connect');

const app = express();

// uses environment variables by default. Set this up when posturing to move to AWS 
// see this when moving to AWS https://node-postgres.com/features/connecting
// note: if this doesnt work contact me and I will add your IP to the whitelist
const pool = new Pool({
    user: 'postgres',
    host: 'se3316.cdu9h2cspncm.us-east-1.rds.amazonaws.com',
    database: 'api',
    password: 'LPLtEQ4Sf4',
    port: 5432
});

// const config = {
//     authRequired: false,
//     auth0Logout: true,
//     secret: '5dfe5959c2eaec4a37902820480ffb96beb201389c981e36b47eb35a69f7e583',
//     baseURL: 'http://localhost:3000',
//     clientID = 'bq7eKDwPxWc2bQtDrTkLOHH2bY1L59DH',
//     issuerBaseURL: 'https://se3316-bsmit272-aelzein2-sahma244-lab4.us.auth0.com'
// }

// add middleware into express pipeline to look at json requests 
app.use(express.json());

app.use(express.static('../client'));

// app.use(auth(config));

// use cors to allow cross-origin resource sharing
app.use(cors({
    origin: '*'
}));

app.get('/api', (req, res) => {
    res.send('Please add /tracks, /albums, /artist, or /genre followed by a resource reference after your request.');
});

// L4 Requirement 2: Local Authentication
// is it part of the /api/? 
app.post("/user/create", async (req, res) => {
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
});

app.post("/user/login", async (req, res) => {
    const username = req.body.username;
    const email = req.body.email_address;
    const password = req.body.password;
    try {
        const query = "SELECT password FROM \"users\" WHERE (username = $1 OR email_address = $2)"
        const result = await pool.query(query, [username, email]);
        if (result.rowCount == 1) {
            if (await argon2.verify(result.rows[0].password, password)) {
                res.send("success");
            } else {
                res.send("password incorrect");
            }
        } else {
            res.status(404).send("Password not found");
        }
    } catch (err) {
        console.log("Err: " + err);
    }
});

app.post("/user/change_password", async (req, res) => {
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
});

// Requirement 1: Get all genre names, IDs, parent IDs
app.get('/api/genres', (req, res) => {
    pool.query('SELECT * FROM genres', (err, resp) => {
        if (err) {
            throw err;
        }

        const obj = new Array();

        for (let i = 0; i < resp['rows'].length; i++) {
            const tempObj = new Object();
            tempObj.genre_id = resp['rows'][i].genre_id;
            tempObj.notracks = resp['rows'][i].notracks;
            tempObj.parent = resp['rows'][i].parent;
            obj[i] = tempObj;
        }

        res.send(obj);
    });
});

// Requirement 2: artist_id 
app.get('/api/artists/:artist_id', (req, res) => {
    const cleanArtistId = sanitizeHtml(req.params.artist_id);

    // find the row for the matching artist in the DB
    pool.query('SELECT * FROM artists WHERE artist_id = $1', [cleanArtistId], (err, resp) => {
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
    });
});

// Requirement 3: track_id
app.get('/api/tracks/:track_id', (req, res) => {
    const cleanTrackId = sanitizeHtml(req.params.track_id);
    pool.query('SELECT album_id, album_title, artist_id, artist_name, tags, track_date_created, track_date_recorded, track_duration, track_genres, track_number, track_title, track_id FROM tracks WHERE track_id = $1', [cleanTrackId], (err, resp) => {
        if (err) {
            throw err;
        }

        if (resp['rows'].length < 1) {
            res.status(404).send('No results found.');
            return;
        } else {
            res.send(resp['rows'][0]);
        }
    });
});

// Requirement 4: return n = 5 track_ids for a query of track title
app.get('/api/tracks/', (req, res) => {
    const cleanQuery = sanitizeHtml(req.query.query);
    const cleanType = sanitizeHtml(req.query.type);
    if (cleanType === "tracks") {
        let sqlStr = 'SELECT DISTINCT track_id FROM tracks WHERE UPPER(track_title) LIKE UPPER(\'%' + cleanQuery + '%\')';
        pool.query(sqlStr, (err, resp) => {
            if (err) {
                throw err;
            }

            if (resp.rows.length == 0) {
                res.status(404).send('No results found.')
                return;
            } else if (resp.rows.length < 5) {
                res.send(resp.rows);
            } else {
                res.send(resp.rows.slice(0, 5));
            }
        });
    } else if (cleanType === "albums") {
        //album_title LIKE \'%' + req.query.query + '%\' OR 
        let sqlStr = 'SELECT DISTINCT album_id FROM albums WHERE UPPER(album_title) LIKE UPPER(\'%' + cleanQuery + '%\')';
        pool.query(sqlStr, (err, resp) => {
            if (err) {
                throw err;
            }

            if (resp.rows.length > 0) {
                let sqlStr2 = 'SELECT DISTINCT track_id FROM tracks WHERE album_id = ' + resp.rows[0].album_id;
                pool.query(sqlStr2, (err, resp2) => {
                    if (err) {
                        throw err;
                    }
                    if (resp2.rows.length == 0) {
                        res.status(404).send('No results found.')
                        return;
                    } else if (resp2.rows.length < 5) {
                        res.send(resp2.rows);
                    } else {
                        res.send(resp2.rows.slice(0, 5));
                    }
                });
            } else {
                res.status(404).send('No results found.')
                return;
            }
        });
    } else if (cleanType === "artists") {
        let sqlStr = 'SELECT DISTINCT artist_id FROM artists WHERE UPPER(artist_handle) LIKE UPPER(\'%' + cleanQuery + '%\')';
        pool.query(sqlStr, (err, resp) => {
            if (err) {
                throw err;
            }

            if (resp.rows.length > 0) {
                let sqlStr2 = 'SELECT track_id FROM tracks WHERE (artist_id = ' + resp.rows[0].artist_id;
                for (let i = 1; i < resp.rows.length; i++) {
                    sqlStr2 += ' OR artist_id = ' + resp.rows[i].artist_id;
                }
                sqlStr2 += ')';

                pool.query(sqlStr2, (err, resp2) => {
                    if (err) {
                        throw err;
                    }
                    if (resp2.rows.length == 0) {
                        res.status(404).send('No results found.')
                        return;
                    } else if (resp2.rows.length < 5) {
                        res.send(resp2.rows);
                    } else {
                        res.send(resp2.rows.slice(0, 5));
                    }
                });
            } else {
                res.status(404).send('No results found.')
                return;
            }
        });
    }
});

// Requirement 5: Get all artist_ids for artist name
app.get('/api/artists', (req, res) => {
    const cleanQuery = sanitizeHtml(req.query.query);

    let sqlStr = 'SELECT DISTINCT artist_id FROM artists WHERE artist_name LIKE \'%' + cleanQuery + '%\'';
    pool.query(sqlStr, (err, resp) => {
        if (err) {
            throw err;
        }
        if (resp.rows.length == 0) {
            res.status(404).send('No results found.')
            return;
        } else {
            res.send(resp.rows);
        }
    });
});

// Requirement 6: Create new playlist 
app.post('/api/playlists/create', async (req, res) => {
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
});

// Requirement 7: Add songs to playlist
// make sure playlist exists before calling this...
app.put('/api/playlists/:playlist_id', async (req, res) => {
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
});

// Requirement 8: Get track_ids for all songs in playlist
app.get('/api/playlists/:playlist_id', (req, res) => {
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
});

// Requirement 9: Delete playlist
app.delete('/api/playlists/:playlist_id', (req, res) => {
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
});

// Requirement 10: Get playlist information
app.get('/api/playlists/', (req, res) => {
    // todo
});

// takes input of mm:ss in text form, outputs equivalent time in seconds
function minutesToSeconds(inputText) {
    const minutes = parseInt(inputText.split(':')[0]);
    const seconds = parseInt(inputText.split(':')[1]);
    return minutes * 60 + seconds;
}

// Have the app listen on the specified port environment variable or 3000 if env var is undefined
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});