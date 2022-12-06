const express = require("express");
const router = express.Router();

const sanitizeHtml = require('sanitize-html');
const pool = require("../pool.js");
const { minutesToSeconds } = require('./helpers');

router.get('/:track_id', (req, res) => {
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

router.get('/', (req, res) => {
    const cleanQuery = sanitizeHtml(req.query.search);
    const cleanType = sanitizeHtml(req.query.type);

    if (cleanQuery === "") {
        res.status(400).send("Enter a search");
        return;
    }

    // tested
    // updated
    if (cleanType === "tracks") {
        let sqlStr = `SELECT DISTINCT track_id, track_genres, track_title, artist_name, track_duration AS track_duration_seconds 
                      FROM tracks 
                      WHERE UPPER(track_title) 
                      LIKE UPPER ('%${cleanQuery}%')
                      LIMIT 5;`;
        pool.query(sqlStr, (err, resp) => {
            if (err) {
                throw err;
            }

            if (resp.rows.length == 0) {
                res.status(404).send('No results found.')
                return;
            }
            let resObj = resp.rows;

            for (let i = 0; i < resp.rows.length; i++) {
                resObj[i].track_duration_seconds = minutesToSeconds(resObj[i].track_duration_seconds);
            }

            res.send(resObj);
            return;
        });
    }

    // tested
    // updated
    else if (cleanType === "albums") {
        //album_title LIKE \'%' + req.query.query + '%\' OR 
        let sqlStr = 'SELECT DISTINCT album_id FROM albums WHERE UPPER(album_title) LIKE UPPER(\'%' + cleanQuery + '%\')';
        pool.query(sqlStr, (err, resp) => {
            if (err) {
                throw err;
            }

            if (resp.rows.length > 0) {
                let sqlStr2 = `SELECT track_id, track_genres, track_title, artist_name, track_duration AS track_duration_seconds
                FROM tracks 
                WHERE album_id = ${resp.rows[0].album_id};`;
                pool.query(sqlStr2, (err, resp2) => {
                    if (err) {
                        throw err;
                    }

                    if (resp2.rows.length == 0) {
                        res.status(404).send('No results found.')
                        return;
                    }
                    let resObj = resp2.rows;

                    for (let i = 0; i < resp2.rows.length; i++) {
                        resObj[i].track_duration_seconds = minutesToSeconds(resObj[i].track_duration_seconds);
                    }

                    res.send(resObj);
                    return;
                });
            }
        });
    }

    // tested
    // updated 
    else if (cleanType === "artists") {
        let sqlStr = 'SELECT DISTINCT artist_id FROM artists WHERE UPPER(artist_handle) LIKE UPPER(\'%' + cleanQuery.replace(/\s/g, "_") + '%\')';
        pool.query(sqlStr, (err, resp) => {
            if (err) {
                throw err;
            }

            if (resp.rows.length > 0) {
                let sqlStr2 = `SELECT track_id, track_genres, track_title, artist_name, track_duration AS track_duration_seconds
                FROM tracks 
                WHERE (artist_id = ${resp.rows[0].artist_id}`;

                for (let i = 1; i < resp.rows.length; i++) {
                    sqlStr2 += ' OR artist_id = ' + resp.rows[i].artist_id;
                }
                sqlStr2 += ') LIMIT 5;';

                pool.query(sqlStr2, (err, resp2) => {
                    if (err) {
                        throw err;
                    }

                    if (resp2.rows.length == 0) {
                        res.status(404).send('No results found.')
                        return;
                    }
                    let resObj = resp2.rows;

                    for (let i = 0; i < resp2.rows.length; i++) {
                        resObj[i].track_duration_seconds = minutesToSeconds(resObj[i].track_duration_seconds);
                    }

                    res.send(resObj);
                    return;
                });
            }
        });
    } else {
        res.status(404).send("type not found");
        return;
    }
});

module.exports = router;