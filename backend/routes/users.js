const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db/db");
const authenticateUser = require("../middleware/authenticateUser");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

/**
 * Register User
 * @route POST /api/register
 * @access Public
 */
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

/**
 * Login User
 * @route POST /api/login
 * @access Public
 */
router.post("login", async (req,res) => {
    const {email, password} = req.body;

    try {
        const userRes = await pool.query(`
            SELECT * FROM users 
            WHERE email = $1`, 
            [email]
        );
        if (userRes.rows.length === 0 ) return res.status(401).json({error: "Invalid credentials"});

        const user = userRes.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials"});

        const token = jwt.sign({ id: user.id, is_admin: user.is_admin}, process.env.JST_SECRET, { expiresIn: "2d"});

        res.json({message: "Login successful", token});
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
        const result = await pool.query(`
            SELECT id, name, email, is_admin 
            FROM users 
            WHERE is = $1`, 
            [req.user.id]
        ); 
        if (result.rows.length === 0) return res.status(404).json({error: "User not found"});

        res.json(result.rows[0]);
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
        const result = await pool.query(`
            SELECT id, name, email, is_admin 
            FROM users`);
        res.json(result.rows);
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

router.patch("/:id/admin", authenticateUser, requireAdmin, async (req,res) => {
    const {id} = req.params;

    try {
        await pool.query(`
            UPDATE users 
            SET is_admin = TRUE 
            WHERE id = $1`, 
            [id]
        );
        res.json({message: "User promoted to admin success"});
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
});

module.exports = router;

