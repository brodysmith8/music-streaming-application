'use strict'

/* Requirement 3: track_id */
exports.track_id = function (req, res) {
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
            return;
        }
    });
}

/* Requirement 4: return n = 5 track_ids for a query of track title */
exports.track_title = function (req, res) {
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
}