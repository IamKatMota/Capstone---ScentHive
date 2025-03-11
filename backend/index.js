const express = require('express');
const pg = require('pg');

const app = express();
app.use(express.json());

//db client
const client = new pg.Client("postgres://kat:Kat1234@localhost:5432/scent_hive_db");

//connect and initialize the tables
const init = async() => {
    try {
        await client.connect();
        console.log("Connected to PostgreSQL"); //DELETE LATER

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
            notes TEXT,
            description TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        );
        
        CREATE TABLE reviews(
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            content TEXT NOT NULL,
            rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
            fragrance_id UUID REFRENCES fragrances(id),
            user_id UUID REFRENCES users(id),
            created_at TIMESTAMP DEFAULT NOW()
        );
        `;
        await client.query(SQL);
        console.log("Database tables initialized successfully"); //DELETE LATER

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