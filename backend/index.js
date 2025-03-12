const express = require('express');
const pool = require("./db/db"); //import db connection
require("dotenv").config();

const app = express();
app.use(express.json());


//initialize the tables
const init = async() => {
    try {
        console.log("Connected to PostgreSQL"); //DEBUG DELETE LATER

        const SQL = `
        DROP TABLE IF EXISTS reviews;
        DROP TABLE IF EXISTS fragrances;
        DROP TABLE IF EXISTS users;

        CREATE TABLE users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE fragrances(
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            brand TEXT NOT NULL,
            launch_date INTEGER NOT NULL,
            perfumers TEXT NOT NULL,
            notes TEXT,
            description TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        );
        
        CREATE TABLE reviews(
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            content TEXT NOT NULL,
            rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
            fragrance_id UUID REFERENCES fragrances(id),
            user_id UUID REFERENCES users(id),
            created_at TIMESTAMP DEFAULT NOW()
        );
        `;
        await pool.query(SQL);
        console.log("Database tables initialized successfully"); //DEBUG DELETE LATER

    } catch (error) {
        console.error("❌ Database initialization error:", error);
    }
};

//run db setup
init();

//global error handling
app.use((error, req, res, next) => {
    res.status(error.status || 500).send({error:error.message})
});

//start express server
const PORT = process.env.PORT || 5001;
app.listen(PORT, ()=> {
    console.log(`🚀 Server running on port ${PORT}`)
});