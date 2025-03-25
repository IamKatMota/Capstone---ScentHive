const pool = require("./db"); //import db connection


//initialize the tables
const init = async() => {
    try {
        // Automatically enable unaccent extension for search queries if not already
        await pool.query(`CREATE EXTENSION IF NOT EXISTS unaccent`);

        console.log("Connected to PostgreSQL"); 

        const SQL = `
        DROP TABLE IF EXISTS reviews;
        DROP TABLE IF EXISTS wishlist;
        DROP TABLE IF EXISTS collection;
        DROP TABLE IF EXISTS disliked;
        DROP TABLE IF EXISTS to_try;
        DROP TABLE IF EXISTS had;
        DROP TABLE IF EXISTS fragrances CASCADE;
        DROP TABLE IF EXISTS users CASCADE;

        CREATE TABLE users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            is_admin BOOLEAN DEFAULT FALSE
        );

        CREATE TABLE fragrances(
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            brand TEXT NOT NULL,
            launch_date INTEGER NOT NULL,
            perfumers TEXT[],
            notes TEXT[],
            top_notes TEXT[],  -- Stores top notes as an array
            heart_notes TEXT[], 
            base_notes TEXT[],            
            description TEXT,
            image TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        );
        
        CREATE TABLE reviews(
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            content TEXT NOT NULL,
            rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
            fragrance_id UUID REFERENCES fragrances(id) ON DELETE CASCADE,
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE wishlist (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            fragrance_id UUID REFERENCES fragrances(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT now(),
            UNIQUE(user_id, fragrance_id)
        );

        CREATE TABLE collection (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            fragrance_id UUID REFERENCES fragrances(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT now(),
            UNIQUE(user_id, fragrance_id)
        );

        CREATE TABLE to_try (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            fragrance_id UUID REFERENCES fragrances(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT now(),
            UNIQUE(user_id, fragrance_id)
        );

        CREATE TABLE disliked (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            fragrance_id UUID REFERENCES fragrances(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT now(),
            UNIQUE(user_id, fragrance_id)
        );

        CREATE TABLE had (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            fragrance_id UUID REFERENCES fragrances(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT now(),
            UNIQUE(user_id, fragrance_id)
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
