const { Pool } = require("pg"); //pool manages mult connections more efficiently than client
require("dotenv").config(); //load credentials securely from .env

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgres://kat:Kat1234@localhost:5432/scent_hive_db"
})

module.exports = pool; 