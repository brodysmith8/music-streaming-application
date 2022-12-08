const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "se3316.cdu9h2cspncm.us-east-1.rds.amazonaws.com",
    database: "api",
    password: "LPLtEQ4Sf4",
    port: 5432,
});

module.exports = pool;
