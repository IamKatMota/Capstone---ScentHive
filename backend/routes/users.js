const express = require("express");
const jwt = require("jsonwebtoken");
const pool = require("../db/db");
const bcrypt = require("bcrypt");
const authenticateUser = require("../middleware/authenticateUser");
const requireAdmin = require("../middleware/requireAdmin");
const {
    registerUser,
    getUserByEmail,
    getUserById,
    getAllUsers,
    promoteUserToAdmin,
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

        const token = jwt.sign({ id: result.id, is_admin: result.is_admin}, process.env.JWT_SECRET, { expiresIn: "2d"});

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

/**
 * Get ALL Users (Admin only)
 * @route GET /api/users
 * @access Private 
 */
router.get("/", authenticateUser, requireAdmin, async (req,res) => {
    try {
        const result = await getAllUsers();
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({error:"Internal Server Error"});
    }
});

/**
 * Update admin status (Admin only)
 * @route PATCH /api/:id/admin
 * @access Private
 */

router.patch("/promote/:id", authenticateUser, requireAdmin, async (req,res) => {
    const {id} = req.params;
    console.log("Promoting user ID:", id); // Debugging log

    try {
        const result = await promoteUserToAdmin(id);
        res.status(200).json({message: "User promoted to admin.", result: result});
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
});

module.exports = router;

