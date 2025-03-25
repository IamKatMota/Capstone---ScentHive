// routes/admin.js
const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authenticateUser");
const requireAdmin = require("../middleware/requireAdmin");
const {
    getAllUsers,
    promoteUserToAdmin,
    demoteUserFromAdmin,
    updateUser,
    deleteUser,
    getAllReviews,
    updateReview,
    deleteReview,
    getAllFragrances,
    createFragrance,
    updateFragrance,
    deleteFragrance
} = require("../models/adminModel");

// Middleware: Authenticated + Admin only
router.use(authenticateUser);
router.use(requireAdmin);

// ========== USER ROUTES ==========

// Get all users
router.get("/users", async (req, res) => {
    try {
        console.log("Fetching all users..."); // Debug log

        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Promote user to admin
router.patch("/users/:id/promote", async (req, res) => {
    try {
        const result = await promoteUserToAdmin(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error promoting user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// Demote user to admin
router.patch("/users/:id/demote", async (req, res) => {
    try {
        const result = await demoteUserFromAdmin(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error demoting user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update user info
router.put("/users/:id", async (req, res) => {
    try {
        const result = await updateUser(req.params.id, req.body);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete user
router.delete("/users/:id", async (req, res) => {
    try {
        const result = await deleteUser(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ========== REVIEW ROUTES ==========

// Get all reviews
router.get("/reviews", async (req, res) => {
    try {
        const reviews = await getAllReviews();
        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Update review
router.put("/reviews/:id", async (req, res) => {
    try {
        const { content, rating } = req.body;
        const result = await updateReview(req.params.id, content, rating);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error updating review:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete review
router.delete("/reviews/:id", async (req, res) => {
    try {
        const result = await deleteReview(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ========== FRAGRANCE ROUTES ==========

// Get all fragrances
router.get("/fragrances", async (req, res) => {
    console.log("Fetching all frags..."); // Debug log

    try {
        const fragrances = await getAllFragrances();
        res.status(200).json(fragrances);
    } catch (error) {
        console.error("Error fetching fragrances:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
//bulk import fragrances from json file
router.post("/import-fragrances", requireAdmin, async (req, res) => {
    try {
        const fragrances = req.body; // JSON array from upload

        for (const frag of fragrances) {
            const exists = await pool.query(
                `SELECT * FROM fragrances 
                WHERE name = $1 AND brand = $2`,
                [frag.name, frag.brand]
            );
            if (exists.rows.length > 0) {
                console.log(`🟡 Skipping duplicate: ${frag.name}`);
                continue;
            }

            await pool.query(
                `INSERT INTO fragrances (
                    id, 
                    name, 
                    brand, 
                    launch_date, 
                    perfumers,
                    notes, 
                    top_notes, 
                    heart_notes, 
                    base_notes,
                    description, 
                    image
                ) 
                VALUES (
                    gen_random_uuid(), 
                    $1, 
                    $2, 
                    $3, 
                    $4,
                    $5, 
                    $6, 
                    $7, 
                    $8, 
                    $9, 
                    $10
                )`,
                [
                    frag.name,
                    frag.brand,
                    frag.launch_date,
                    frag.perfumers,
                    frag.notes,
                    frag.top_notes,
                    frag.heart_notes,
                    frag.base_notes,
                    frag.description,
                    frag.image
                ]
            );
        }

        res.status(200).json({ message: "Fragrances imported successfully." });
    } catch (error) {
        console.error("❌ Import failed:", error);
        res.status(500).json({ error: "Failed to import fragrances." });
    }
});

// Create fragrance
router.post("/fragrances", async (req, res) => {
    try {
        const result = await createFragrance(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error("Error creating fragrance:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update fragrance
router.put("/fragrances/:id", async (req, res) => {
    try {
        const result = await updateFragrance(req.params.id, req.body);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error updating fragrance:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete fragrance
router.delete("/fragrances/:id", async (req, res) => {
    try {
        const result = await deleteFragrance(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error deleting fragrance:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;