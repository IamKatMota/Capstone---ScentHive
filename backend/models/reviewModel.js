const pool = require("../db/db");

// Add a review
const addReview = async (fragrance_id, user_id, content, rating) => {
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
        [fragrance_id, user_id, content, rating]
    );
    return result.rows[0];
};

// Get latest 5 reviews with user and fragrance info
const getLatestReviews = async () => {
    const result = await pool.query(`
        SELECT 
            reviews.id, 
            reviews.content, 
            reviews.rating, 
            reviews.created_at,
            users.name AS user_name, 
            fragrances.name AS fragrance_name
        FROM reviews
        JOIN users ON reviews.user_id = users.id
        JOIN fragrances ON reviews.fragrance_id = fragrances.id
        ORDER BY reviews.created_at DESC
        LIMIT 5
    `);
    return result.rows;
};

// Get all reviews for a specific fragrance
const getReviewsByFragrance = async (fragrance_id) => {
    const result = await pool.query(`
        SELECT r.id, r.content, r.rating, r.user_id, r.created_at, u.name AS reviewer
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.fragrance_id = $1`,
        [fragrance_id]
    );
    return result.rows;
};

// Edit a review
const editReview = async (id, content, rating, user_id, is_admin) => {
    // Check if the review exists and belongs to the user
    const review = await pool.query(
        "SELECT user_id FROM reviews WHERE id = $1", 
        [id]
    );

    if (review.rows.length === 0) {
        throw new Error("Review not found");
    }
    const ownerId = review.rows[0].user_id;

    // Check permission
    if (ownerId !== user_id && !is_admin) {
        throw new Error("Unauthorized to edit this review");
    }
    // Proceed with update if authorized
    const result = await pool.query(`
        UPDATE reviews
        SET content = $1, rating = $2
        WHERE id = $3
        RETURNING *`,
        [content, rating, id]
    );
    return result.rows[0];
};

// Delete a review
const deleteReview = async (id, user_id, is_admin) => {
    const result = await pool.query(`
        DELETE FROM reviews
        WHERE id = $1
        AND (user_id = $2 OR $3 = true)
        RETURNING *`,
        [id, user_id, is_admin]
    );
    return result.rows[0];
};

// Get review's owner by ID
const getReviewOwner = async (id) => {
    const result = await pool.query(
        "SELECT user_id FROM reviews WHERE id = $1", 
        [id]
    );
    return result.rows[0];
};

module.exports = {
    addReview,
    getLatestReviews,
    getReviewsByFragrance,
    editReview,
    deleteReview,
    getReviewOwner,
};