'use strict'

// Requirement 1: Get all genre names, IDs, parent IDs
exports.get_genres = function (req, res) {
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
}