const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db/db");
const authenticateUser = require("../middleware/authenticateUser");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

//register new user
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            `INSERT INTO users (
                id,
                name,
                email,
                password
            )
            VALUES (
                gen_random_uuid(), 
                $1, 
                $2, 
                $3
            )
            RETURNING id, name, email`, [name, email, hashedPassword]
        );
        res.status(201).json({message: "User registered successfully", user: result.rows[0]});
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
});

//user login and token generation