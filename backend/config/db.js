const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "dental_saas",
    password: "K4rth1ck13@",
    port: 5432
});

module.exports = pool;