const express = require("express"); // import express
const router = express.Router(); // create a router
const sanitizeHtml = require("sanitize-html"); // import sanitize-html
const pool = require("../pool.js"); // import the pool

router.get("/", async (req, res) => {
    // route that site manager can use to get the dmca policy

    const dmcaPolicy = await pool.query("SELECT * FROM dmca_policy"); // get the dmca policy from the database
    res.send(dmcaPolicy.rows[0]); // send the dmca policy to the site manager
});

router.post("/", async (req, res) => {
    // route that site manager can use to update the dmca policy

    const dmcaPolicyInformation = sanitizeHtml(
        req.body.dmca_policy_information
    ); // policy information from the dmca policy table
    const dmcaID = sanitizeHtml(req.body.dmcaID); // policy ID from the dmca policy table
    const query = `UPDATE dmca_policy SET dmca_policy_information = \'${dmcaPolicyInformation}\', dmca_id = ${dmcaID}`; // query to update the dmca policy
    console.log(query);

    await pool.query(query, (err, doc) => {
        // callback function to handle errors and successful updates *Want to send a document as a parameter to the callback function*?

        if (err) {
            // send a response error message to the site manager if the update fails
            res.status(500).send("Error updating DMCA Policy!");
        } else {
            // send a response message to the site manager if the update is successful
            res.send("DMCA Policy updated!");
        }
    });
});

router.put("/", async (req, res) => {
    // route that site manager can use to create a new dmca policy

    const dmcaPolicyInformation = sanitizeHtml(
        req.body.dmca_policy_information
    ); // policy information from the dmca policy table
    const dmcaID = sanitizeHtml(req.body.dmcaID); // policy ID from the dmca policy table
    const query = `INSERT INTO dmca_policy (dmca_policy_information, dmca_id) VALUES (\'${dmcaPolicyInformation}\', ${dmcaID})`; // query to create a new dmca policy
    console.log(query);

    await pool.query(query, (err, doc) => {
        // callback function to handle errors and successful updates *Want to send a document as a parameter to the callback function*?

        if (err) {
            // send a response error message to the site manager if the update fails
            res.status(500).send("Error creating DMCA Policy!");
        } else {
            // send a response message to the site manager if the update is successful
            res.send("DMCA Policy created!");
        }
    });
});

module.exports = router; // export the router
