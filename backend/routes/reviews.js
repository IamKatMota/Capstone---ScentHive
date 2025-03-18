const express = require("express");
const pool = require("../db/db");
const authenticateUser = require("../middleware/authenticateUser");

const router = express.Router();

/**
 * Add a Review (Authenticated Users)
 * @route POST /api/reviews
 * @access Private
 */
router.post("/", authenticateUser, async (req,res)=> {
    const {fragrance_id, content, rating} = req.body;

    try {
        const result = await pool.query(`
            INSERT INTO reviews (
                id, 
                fragrance_id, 
                user_id, 
                content, 
                rating
            )
            VALUES (
                gen_random_uuid(),
                $1,
                $2,
                $3,
                $4
            )
            RETURNING *`, 
            [fragrance_id, req.user.id, content, rating]
        );
        res.status(201).json({message: "Review added successfully", review: result.rows[0]});
    } catch (error) {
        console.error("Error adding review", error);
        res.status(500).json({error: "Internal Server Error"});
    }
});

/**
 * Get All Reviews for a Fragrance
 * @route GET /api/reviews/:fragrance_id
 * @access Public
 */
router.get("/:fragrance_id", async(req,res)=> {
    const {fragrance_id} = req.params;
    try {
        const result = await pool.query(`
            SELECT r.id, r.content, r.rating, u.name AS reviewer
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.fragrance_id = $1`,
            [fragrance_id]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
});

/**
 * Edit Review (Only by the Reviewer)
 * @route PATCH /api/reviews/:id
 * @access Private
 */
router.patch("/:id", authenticateUser, async (req,res)=>{
    const {id} = req.params;
    const {content, rating} = req.body;
    console.log("Logged-in User ID:", req.user.id);
    console.log("Attempting to edit review ID:", id);

    try {
        // Check if the review exists and belongs to the user
        const review = await pool.query(
            "SELECT user_id FROM reviews WHERE id = $1", 
            [id]
        );

        if (review.rows.length === 0) {
            return res.status(404).json({ error: "Review not found" });
        }

        // Check if the user owns the review or is an admin
        if (review.rows[0].user_id !== req.user.id && !req.user.is_admin) {
            return res.status(403).json({ error: "Forbidden: You do not have permission to edit this review" });
        }
        // Proceed with update if authorized
        const result = await pool.query(`
            UPDATE reviews
            SET content = $1, rating = $2
            WHERE id = $3
            AND (user_id = $4 OR $5 = true)
            RETURNING *`,
            [content, rating, id, req.user.id, req.user.is_admin]
        );

        if(result.rows.length === 0) return res.status(403).json({error: "Unauthorized to edit this review"});

        res.status(200).json({message: "Review updated successfully", review: result.rows[0]});
    } catch (error) {
        console.error("Error updating review:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
});


/**
 * Delete Review (Only by Reviewer or Admin)
 * @route DELETE /api/reviews/:id
 * @access Private (Reviewer or Admin)
 */

router.delete("/:id", authenticateUser, async (req,res)=> {
    const {id} = req.params;

    try {
        const result = await pool.query(`
            DELETE FROM reviews
            WHERE id = $1
            AND (user_id = $2 OR $3 = true)
            RETURNING *`,
            [
                id, 
                req.user.id, 
                req.user.is_admin
            ]);
        if (result.rows.length === 0) return res.status(500).json({error: "Unauthorized to delete this review"});

        res.status(200).json({message: "Review deleted successfully", deletedReview: result.rows[0]});
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
});

module.exports = router;