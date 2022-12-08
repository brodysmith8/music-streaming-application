const express = require("express"); // import express
const router = express.Router(); // create a router
const sanitizeHtml = require("sanitize-html"); // import sanitize-html
const app = require("../app.js"); // import the app
const pool = require("../pool.js"); // import the pool


router.get("/", async (req, res) => { // route that site manager can use to get the privacy policy
    
    const privPolicy = await pool.query("SELECT * FROM privacy_policy"); // get the privacy policy from the database
    res.send(privPolicy.rows[0]); // send the privacy policy to the site manager
    });


router.post( "/", async (req, res) => { // route that site manager can use to update the privacy policy

        const policyInformation = sanitizeHtml(req.body.policyInformation); // policy information from the privacy policy table
        const policyID = sanitizeHtml(req.body.policyID); // policy ID from the privacy policy table
        const query = `UPDATE privacy_policy SET policy_information = \'${policyInformation}\', policy_id = ${policyID}`
        console.log(query);

        await pool.query(query, (err, doc) => { // callback function to handle errors and successful updates *Want to send a document as a parameter to the callback function*?
            
            if (err){

                // send a response error message to the site manager if the update fails
                res.status(500).send("Error updating Privacy Policy!");
            }

            else {

                // send a response message to the site manager if the update is successful
                res.send("Privacy Policy updated!");
            }
    });

});

router.put("/", async (req, res) => { // route that site manager can use to create a new privacy policy

    const policyInformation = sanitizeHtml(req.body.policyInformation); // policy information from the privacy policy table
    const policyID = sanitizeHtml(req.body.policyID); // policy
    const query = `INSERT INTO privacy_policy (policy_information, policy_id) VALUES (\'${policyInformation}\', ${policyID})`

    console.log(query);

    await pool.query(query, (err, doc) => { // callback function to handle errors and successful updates *Want to send a document as a parameter to the callback function*?

        if (err){

            // send a response error message to the site manager if the update fails
            res.status(500).send("Error creating Privacy Policy!");
        }

        else {

            // send a response message to the site manager if the update is successful
            res.send("Privacy Policy created!");

        }
    });

});

module .exports = router; // export the router

