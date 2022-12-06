"use strict";

const express = require('express');
const cors = require('cors');

// routes
const playlists =  require('./routes/playlists');
const genres =  require('./routes/genres');
const artists =  require('./routes/artists');
const tracks =  require('./routes/tracks');
const user =  require('./routes/user');

const app = express();
module.exports = app;

app.use(express.json());
/* app.use(express.static('../client')); */
app.use(cors({ origin: '*' }));
/* app.use(auth(config)); */

// General

app.get('/api', (req, res) => {
    res.send('Please add /tracks, /albums, /artist, or /genre followed by a resource reference after your request.');
});

// User
app.use('/user', user);

// Genres
app.use('/api/genres', genres);

// Artists
app.use('/api/artists', artists);

// Tracks
app.use('/api/tracks', tracks);

// Playlists
app.use('/api/playlists', playlists);

// Have the app listen on the specified port environment variable or 3000 if env var is undefined
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});