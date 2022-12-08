const express = require("express");
const router = express.Router();
const private =  require('./private/playlists');

const passport = require("passport");
const sanitizeHtml = require("sanitize-html");
const pool = require("../pool.js");


router.post('/:playlist_id', passport.authenticate("jwt", { session: false }), async (req, res) => {
    const username = req.user.username;
    const comment = sanitizeHtml(req.body.review_text);
    const rating = sanitizeHtml(req.body.rating);
    const dt = new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString();

    // something the db should handle
    if (rating === "") { 
        res.status(400).send("Rating is empty")
        return; 
    }

    // double check that reviewed playlist is public (front end should take care of this but crafted request maybe could mess it up)
    const isPublicResponse = await pool.query("SELECT is_private FROM playlists WHERE playlist_id = $1", [req.params.playlist_id]);
    if (isPublicResponse.rowCount === 0) {
        res.status(404).send("No playlist with that ID to review");
        return;
    }

    if (isPublicResponse.rows[0].is_private) {
        res.status(401).send("Not a public playlist");
        return;
    }

    // add to reviews then to playlist_reviews
    const reviewQuery = `INSERT INTO reviews (review_out_of_ten, comment_text, is_hidden, username, posted_date) VALUES (${rating}, \'${comment}\', ${false}, \'${username}\', \'${dt}\') RETURNING review_id;`;
    const insertResponse = await pool.query(reviewQuery);
    const pReviewQuery = `INSERT INTO playlist_reviews VALUES (${req.params.playlist_id}, ${insertResponse.rows[0].review_id})`;
    const pReviewResponse = await pool.query(pReviewQuery);

    // calculate avg playlist rating and update playlists
    // might move to own function
    const updateAvgRatingQuery = `SELECT SUM(t1.review_out_of_ten) / COUNT(t1.playlist_id) AS avg_review FROM (SELECT * 
        FROM playlist_reviews pr
        LEFT JOIN reviews r
        ON pr.review_id = r.review_id) AS t1
        WHERE playlist_id = ${req.params.playlist_id}
        GROUP BY playlist_id`;
    const updateAvgRatingResponse = await pool.query(updateAvgRatingQuery); 

    await pool.query("UPDATE playlists SET average_rating = $1 WHERE playlist_id = $2", [updateAvgRatingResponse.rows[0].avg_review, req.params.playlist_id]);
    
    res.send(`${insertResponse.rows[0].review_id}`);
});

// dont need to be authenticated to do this
router.get('/:playlist_id', async (req, res) => {
    const cleanPId = sanitizeHtml(req.params.playlist_id);

    const getRevsQuery = `SELECT * 
    FROM reviews r
    WHERE r.review_id IN (SELECT pr.review_id FROM playlist_reviews pr WHERE pr.playlist_id = ${cleanPId}) AND r.is_hidden=false`;
    const result = await pool.query(getRevsQuery);

    if (result.rowCount === 0) {
        res.status(404).send("Playlist has no reviews.");
        return;
    }
    
    res.send(result.rows);
    return;
});

// for admin to set visible or not
router.put('/:review_id', passport.authenticate("jwt", { session: false }), async (req, res) => {});

module.exports = router;