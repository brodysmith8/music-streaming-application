const express = require("express"); // import express
const router = express.Router(); // create a router
const sanitizeHtml = require("sanitize-html"); // import sanitize-html
const app = require("../app.js"); // import the app
const pool = require("../pool.js"); // import the pool


router.get("/", async (req, res) => { // route that site manager can use to get the aup policy

    const aupPolicy = await pool.query("SELECT * FROM aup_policy"); // get the aup policy from the database
    res.send(aupPolicy.rows[0]); // send the aup policy to the site manager
    
    });

router.post("/", async (req, res) => { // route that site manager can use to update the aup policy

        const aupPolicyInformation = sanitizeHtml(req.body.aup_policy_information); // policy information from the aup policy table
        const aupID = sanitizeHtml(req.body.aupID); // policy ID from the aup policy table
        const query = `UPDATE aup_policy SET aup_policy_information = \'${aupPolicyInformation}\', aup_id = ${aupID}` // query to update the aup policy
        console.log(query);
        
        await pool.query(query, (err, doc) => { // callback function to handle errors and successful updates *Want to send a document as a parameter to the callback function*?

            if (err){

                // send a response error message to the site manager if the update fails
                res.status(500).send("Error updating AUP policy!");
            }

            else {

                // send a response message to the site manager if the update is successful
                res.send("AUP policy updated!");
            }

        });
});

router.put("/", async (req, res) => { // route that site manager can use to create a new aup policy

    const aupPolicyInformation = sanitizeHtml(req.body.aup_policy_information); // policy information from the aup policy table
    const aupID = sanitizeHtml(req.body.aupID); // policy ID from the aup policy table
    const query = `INSERT INTO aup_policy (aup_policy_information, aup_id) VALUES (\'${aupPolicyInformation}\', ${aupID})` // query to create a new aup policy

    console.log(query);

    await pool.query (query, (err, doc) => { // callback function to handle errors and successful updates *Want to send a document as a parameter to the callback function*?
                
            if (err){

                // send a response error message to the site manager if the update fails
                res.status(500).send("Error creating AUP policy!");
            }

            else {

                // send a response message to the site manager if the update is successful
                res.send("AUP policy created!");

                }
            }
        );
});


module.exports = router; // export the router