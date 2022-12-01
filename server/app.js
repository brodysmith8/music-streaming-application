"use strict";

const { application } = require('express');
const express = require('express');
const cors = require('cors');
const sanitizeHtml = require('sanitize-html');
const { Pool } = require('pg');
const argon2 = require('argon2');
const general = require('./general');
const user = require('./user');
const genres = require('./genres');
const artists = require('./artists');
const tracks = require('./tracks');
const playlists = require('./playlists')
// const { auth } = require('express-openid-connect');

// Config

const app = express();
module.exports = app; 

app.use(express.json());
/* app.use(express.static('../client')); */
app.use(cors({ origin: '*' }));
/* app.use(auth(config)); */

/* RDS database connection */
const pool = new Pool({
    user: 'postgres',
    host: 'se3316.cdu9h2cspncm.us-east-1.rds.amazonaws.com',
    database: 'api',
    password: 'LPLtEQ4Sf4',
    port: 5432
});

// General
app.get('/api', general.api);

// User
app.post("/user/create", user.create);
app.post("/user/login", user.login);
app.post("/user/change_password", user.change_password);

// Genres
app.get('/api/genres', genres.get_genres);

// Artists
app.get('/api/artists/:artist_id', artists.artist_id);

/* Requirement 5: Get all artist_ids for artist name */
app.get('/api/artists', artists.artist_name);

// Tracks
app.get('/api/tracks/:track_id', tracks.track_id);
app.get('/api/tracks/', tracks.track_title);

// Playlists
app.post('/api/playlists/create', playlists.create);
app.put('/api/playlists/:playlist_id', playlists.add_songs);
app.get('/api/playlists/:playlist_id', playlists.get_track_ids_for_playlist);
app.delete('/api/playlists/:playlist_id', playlists.delete_playlist);

/* not implemented right now */
app.get('/api/playlists/', playlists.get_playlist_information);

// Utility

/* takes input of mm:ss in text form, outputs equivalent time in seconds */
function minutesToSeconds(inputText) {
    const minutes = parseInt(inputText.split(':')[0]);
    const seconds = parseInt(inputText.split(':')[1]);
    return minutes * 60 + seconds;
}

// Miscellaneous 

/* Have the app listen on the specified port environment variable or 4000 if env var is undefined */
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});