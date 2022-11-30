"use strict";

// this script is a service-side script. It runs on the AWS machine. 
// Thus, we may use localhost to connect to the API.  

const { application } = require('express');
const express = require('express');
const cors = require('cors');
const sanitizeHtml = require('sanitize-html');
const { Pool } = require('pg');

const app = express();

// uses environment variables by default. Set this up when posturing to move to AWS 
// see this when moving to AWS https://node-postgres.com/features/connecting
const pool = new Pool({
    user: 'postgres',
    host: 'se3316.cdu9h2cspncm.us-east-1.rds.amazonaws.com',
    database: 'api',
    password: 'LPLtEQ4Sf4',
    port: 5432
});

// add middleware into express pipeline to look at json requests 
app.use(express.json());

app.use(express.static('../client'));

// use cors to allow cross-origin resource sharing
app.use(cors({
    origin: '*'
}));

app.get('/api', (req, res) => {
    res.send('Please add /tracks, /albums, /artist, or /genre followed by a resource reference after your request.');
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
app.post('/api/playlists/:playlist_id', (req, res) => {
    // song list is in request body
    const playlistName = sanitizeHtml(req.body.playlist_name);
    const userId = sanitizeHtml(req.body.user_id);
    const cleanPlaylistId = sanitizeHtml(req.params.playlist_id);

    // check if playlist with playlist_id exists
    pool.query('SELECT DISTINCT playlist_id FROM playlists WHERE playlist_id = $1', [cleanPlaylistId], (err, resp) => {
        if (err) {
            throw err;
        }
        if (resp.rows.length > 0) {
            res.status(409).send("Playlist already exists"); // error 409 Conflict. Indicates that the request could not be completed due to a conflict with the current state of the target resource. (RFC 7231 6.5.8)  
            return;
        } else {
            pool.query('INSERT INTO playlists (playlist_id, playlist_name, playlist_user, track_id) VALUES ($1, $2, $3, $4)', [cleanPlaylistId, playlistName, userId, 0]); // 0 track id means empty playlist
            res.send(cleanPlaylistId);
        }
    });
});

// Requirement 7: Add songs to playlist
app.put('/api/playlists/:playlist_id', (req, res) => {
    const songList = sanitizeHtml(req.body.track_list).split(',');
    const playlistName = sanitizeHtml(req.body.playlist_name);
    const userId = sanitizeHtml(req.body.user_id);
    const cleanPlaylistId = sanitizeHtml(req.params.playlist_id);

    // DB assumption: user can only have distinct songs in a playlist; no repeats

    // check if playlist with playlist_id exists
    pool.query('SELECT DISTINCT playlist_id FROM playlists WHERE playlist_id = $1', [cleanPlaylistId], (err, resp) => {
        if (err) {
            throw err;
        }
        if (resp.rows.length < 1) {
            res.status(404).send("Playlist does not exist");
            return;
        } else {
            // make sure playlist is empty; if not, replace all songs (seems silly to me but thats what the requirement is)
            pool.query('SELECT playlist_id FROM playlists WHERE playlist_id = $1 AND track_id = 0', [cleanPlaylistId], (err, resp) => {
                if (err) {
                    throw err;
                }

                if (resp.rows.length > 0) {
                    let str = 'SELECT track_id FROM tracks WHERE track_id = ' + songList[0];
                    let result = new Array();
                    for (let i = 1; i < songList.length; i++) {
                        str += " OR track_id = " + songList[i];
                    }
                    pool.query(str, (err, resp3) => {
                        if (err) {
                            throw err;
                        }

                        if (resp3.rows.length === songList.length) {
                            // if the playlist exists and is empty
                            pool.query('DELETE FROM playlists WHERE playlist_id = $1', [cleanPlaylistId]); // delete empty playlist entry

                            for (let i = 1; i < songList.length + 1; i++) {
                                pool.query('INSERT INTO playlists (playlist_id, playlist_name, playlist_user, track_id) VALUES ($1, $2, $3, $4)', [cleanPlaylistId, playlistName, userId, songList[i - 1]]);
                            }
                            res.send(cleanPlaylistId);
                        } else {
                            res.status(404).send("One of those track_ids doesn't exist.")
                        }
                    })

                } else {
                    // if the playlist exists and has things in it; delete and replace
                    pool.query('DELETE FROM playlists WHERE playlist_id = $1', [cleanPlaylistId]); // delete empty playlist entry

                    for (let i = 1; i < songList.length + 1; i++) {
                        pool.query('INSERT INTO playlists (playlist_id, playlist_name, playlist_user, track_id) VALUES ($1, $2, $3, $4)', [cleanPlaylistId, playlistName, userId, songList[i - 1]]);
                    }

                    res.send(cleanPlaylistId);
                }
            });
        }
    });
});

// Requirement 8: Get track_ids for all songs in playlist
app.get('/api/playlists/:playlist_id', (req, res) => {
    const cleanPlaylistId = sanitizeHtml(req.params.playlist_id);
    pool.query('SELECT track_id FROM playlists WHERE playlist_id = $1', [cleanPlaylistId], (err, resp) => {
        if (err) {
            throw err;
        }

        if (resp.rows.length < 1) {
            res.status(404).send('Playlist does not exist');
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
    pool.query('SELECT playlist_id FROM playlists WHERE playlist_id = $1', [cleanPlaylistId], (err, resp) => {
        if (resp.rows.length > 0) {
            pool.query('DELETE FROM playlists WHERE playlist_id = $1', [cleanPlaylistId], (err, resp) => {
                res.send(cleanPlaylistId);
            });
        } else {
            res.status(404).send("No playlist matching that name was found.")
            return;
        }
    });
});

// Requirement 10: Get playlist information
app.get('/api/playlists/', (req, res) => {
    /* Returns:
    *    __________________________________________
    *   | playlist_id | playlist_name | song_count |
    *   |_____________|_______________|____________|
    * 
    *   it is ordered by ascending playlist_id. Iff playlist_id's are assigned sequentially starting from 1, then resp.rows[i] necessarily correlates to the zero-counted i+1-th playlist
    *   i.e. if you're looking for playlist 1253, resp.rows[1252] will give you that 
    */
    pool.query('SELECT playlist_id, playlist_name, COUNT(CASE WHEN track_id != 0 THEN 1 ELSE NULL END) AS song_count FROM playlists GROUP BY (playlist_id, playlist_name) ORDER BY playlist_id ASC', (err, resp) => {
        if (err) {
            throw err;
        }
        const songCountsByPlaylistId = resp.rows;

        // now calculate running time
        /* Returns:
        *    _________________________________________________________
        *   | playlist_id | playlist_name | track_id | track_duration |
        *   |_____________|_______________|__________|________________|
        */

        pool.query('SELECT playlist_id, playlist_name, playlists.track_id, tracks.track_duration FROM playlists NATURAL JOIN tracks GROUP BY (playlist_id, playlist_name, playlists.track_id, tracks.track_duration) ORDER BY playlist_id ASC', (err, response) => {
            if (err) {
                throw err;
            }

            const tracksByPlaylistId = response.rows;
            let runningTimesPerPlaylist = new Array(songCountsByPlaylistId.length).fill(0);

            let songIdx = 0;
            for (let playlistIdx = 0; playlistIdx < songCountsByPlaylistId.length + 1; playlistIdx++) {
                while (songIdx < tracksByPlaylistId.length && playlistIdx === tracksByPlaylistId[songIdx].playlist_id) {
                    runningTimesPerPlaylist[playlistIdx - 1] += minutesToSeconds(tracksByPlaylistId[songIdx].track_duration);
                    songIdx++;
                }
            }

            // join the total running times to their respective playlists in songCountsByPlaylistId
            for (let i = 0; i < songCountsByPlaylistId.length; i++) {
                songCountsByPlaylistId[i].running_time = runningTimesPerPlaylist[i]; // notice the map of i between songCountsByPlaylistId and runningTimesPerPlaylist 
            }

            res.send(songCountsByPlaylistId);
        });
    });
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