const express = require("express");
const jwt = require("jsonwebtoken");
const pool = require("../db/db");
const bcrypt = require("bcrypt");
const authenticateUser = require("../middleware/authenticateUser");
const {
    registerUser,
    getUserByEmail,
    getUserById,
} = require("../models/userModel");


const router = express.Router();

/**
 * Register User
 * @route POST /api/register
 * @access Public
 */
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const result = await registerUser(name, email, password);
        res.status(201).json({message: "User registered successfully", user: result});
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
});

/**
 * Login User
 * @route POST /api/login
 * @access Public
 */
router.post("/login", async (req,res) => {
    const {email, password} = req.body;
    try {
        const result = await getUserByEmail(email);
        if (!result) return res.status(401).json({error: "Invalid credentials"});

        const isMatch = await bcrypt.compare(password, result.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials"});

        const token = jwt.sign({ id: result.id, name: result.name,is_admin: result.is_admin}, process.env.JWT_SECRET, { expiresIn: "3h"});

        res.status(201).json({message: "Login successful", token});
    }catch(error) {
        console.error("Error logging in:", error);
        res.status(500).json({error: "Internal Server Error:"});
    }
});

/**
 * Get Current User (Authenticated User)
 * @route GET /api/me
 * @access Private
 */
router.get("/me", authenticateUser, async (req,res) => {
    try {
        const result = await getUserById(req.user.id); 
        if (!result) return res.status(404).json({error: "User not found"});

        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal Server Error"});
    }
});



module.exports = router;

