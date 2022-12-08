"use strict";

require('dotenv').config();
const express = require('express');
const cors = require('cors');

// authentication
require("./auth/passport");

// routes
const playlists =  require('./routes/playlists');
const genres =  require('./routes/genres');
const artists =  require('./routes/artists');
const tracks =  require('./routes/tracks');
const user =  require('./routes/user');
const privacyPolicy = require('./routes/privacyPolicy'); // import the privacy policy route
const dmca = require('./routes/dmca');  // import the dmca route
const aup = require('./routes/aup'); // import the aup route
const admin = require('./routes/admin');

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
app.use('/api/user', user);

// Genres
app.use('/api/genres', genres);

// Artists
app.use('/api/artists', artists);

// Tracks
app.use('/api/tracks', tracks);

// Playlists
app.use('/api/playlists', playlists);

// Route for a site manager to be able to add a privacy policy
app.use('/api/privacy_policy', privacyPolicy);

// Route for a site manager to be able to add a dmca policy
app.use('/api/dmca_policy', dmca);

// Route for a site manager to be able to add an AUP policy
app.use('/api/aup_policy', aup);

// Admin
app.use('/api/admin', admin);

// Have the app listen on the specified port environment variable or 3000 if env var is undefined
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});