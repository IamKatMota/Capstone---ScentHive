const express = require("express");
const pool = require("../db/db");
const authenticateUser = require("../middleware/authenticateUser");
const {
    addReview,
    getLatestReviews,
    getReviewsByFragrance,
    editReview,
    getReviewsByUser,
    deleteReview
} = require("../models/reviewModel");

const router = express.Router();

/**
 * Add a Review (Authenticated Users)
 * @route POST /api/reviews
 * @access Private
 */
router.post("/", authenticateUser, async (req,res)=> {
    const {fragrance_id, content, rating} = req.body;
    const user_id = req.user.id;
    const reviewer = req.user.name; 

    try {
        const result = await addReview(fragrance_id, user_id, content, rating);
        res.status(201).json({message: "Review added successfully", review: {...result, reviewer}});
    } catch (error) {
        console.error("Error adding review", error);
        res.status(500).json({error: "Internal Server Error"});
    }
});
// Get the latest reviews
router.get("/latest", async (req, res) => {
    try {
        const result = await getLatestReviews();
        res.status(200).json(result);
    } catch (err) {
        console.error("Error fetching latest reviews:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
//Get all reviews for a user
router.get("/user", authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("Fetching reviews for user:", userId);

        if (!userId) return res.status(400).json({ error: "No user ID" });

        const result = await getReviewsByUser(userId);
        res.json(result);
    } catch (err) {
        console.error("Error fetching user's reviews:", err);
        res.status(500).json({ error: err.message });
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
        const result = await getReviewsByFragrance(fragrance_id);
        res.status(200).json(result);
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
        const result = await editReview(
            req.params.id,
            content,
            rating,
            req.user.id,
            req.user.is_admin
        );

        if(result.length === 0) return res.status(403).json({error: "Unauthorized to edit this review"});

        res.status(200).json({message: "Review updated successfully", review: result});
    } catch (error) {
        console.error("Error updating review:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
});

/**
 * Delete Review (Only by Reviewer)
 * @route DELETE /api/reviews/:id
 * @access Private (Reviewer)
 */

router.delete("/:id", authenticateUser, async (req,res)=> {
    const reviewId = req.params.id;

    try {
        const result = await deleteReview(
            reviewId,
            req.user.id        
        );
        if (!result) return res.status(403).json({error: "Unauthorized to delete this review"});

        res.status(200).json({message: "Review deleted successfully", deletedReview: result});
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
});

module.exports = router;