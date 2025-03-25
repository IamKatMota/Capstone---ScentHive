const pool = require("../db/db");

// Get all users with additional info (review count)
const getAllUsers = async () => {
    const result = await pool.query(`
        SELECT 
            u.id, 
            u.name, 
            u.email, 
            u.is_admin, 
            COUNT(r.id) AS review_count
        FROM users u
        LEFT JOIN reviews r ON u.id = r.user_id
        GROUP BY u.id
        ORDER BY u.name
    `);
    return result.rows;
};

// Update user info
const updateUser = async (userId, { name, email }) => {
    const result = await pool.query(`
        UPDATE users 
        SET name = $1, email = $2 
        WHERE id = $3 
        RETURNING *`,
        [name, email, userId]
    );
    return result.rows[0];
};

// Promote a user to admin
const promoteUserToAdmin = async (userId) => {
    const result = await pool.query(
        `UPDATE users 
        SET is_admin = true 
        WHERE id = $1 
        RETURNING *`,
        [userId]
    );
    return result.rows[0];
};

// Demote a user from admin
const demoteUserFromAdmin = async (userId) => {
    const result = await pool.query(
        `UPDATE users 
        SET is_admin = false 
        WHERE id = $1 
        RETURNING *`,
        [userId]
    );
    return result.rows[0];
};

// Delete a user
const deleteUser = async (userId) => {
    const result = await pool.query(
        `DELETE FROM users 
        WHERE id = $1 
        RETURNING *`,
        [userId]
    );
    return result.rows[0];
};

// Get all reviews
const getAllReviews = async () => {
    const result = await pool.query(`
        SELECT 
            r.id, 
            r.content, 
            r.rating, 
            r.created_at, 
            u.name AS reviewer_name, 
            f.name AS fragrance_name
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        JOIN fragrances f ON r.fragrance_id = f.id
        ORDER BY r.created_at DESC
    `);
    return result.rows;
};

// Update a review
const updateReview = async (reviewId, content, rating) => {
    const result = await pool.query(
        `UPDATE reviews 
        SET 
            content = $1, 
            rating = $2 
        WHERE id = $3 
        RETURNING *`,
        [content, rating, reviewId]
    );
    return result.rows[0];
};

// Delete a review
const deleteReview = async (reviewId) => {
    const result = await pool.query(
        `DELETE FROM reviews 
        WHERE id = $1 
        RETURNING *`,
        [reviewId]
    );
    return result.rows[0];
};

// Admin fragrance management
const createFragrance = async (name, brand, launch_date, perfumers, notes, top_notes, heart_notes, base_notes, description, image) => {
    const result = await pool.query(
        `INSERT INTO fragrances (
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
        ) VALUES (
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
        ) RETURNING *`,
        [name, brand, launch_date, perfumers, notes, top_notes, heart_notes, base_notes, description, image]
    );
    return result.rows[0];
};

// Get all fragrances
const getAllFragrances = async () => {
    const result = await pool.query(`SELECT * FROM fragrances ORDER BY name`);
    return result.rows;
};

const updateFragrance = async (id, data) => {
    const {
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
    } = data;
    const result = await pool.query(
        `UPDATE fragrances 
        SET 
            name = $1, 
            brand = $2, 
            launch_date = $3, 
            perfumers = $4, 
            notes = $5, 
            top_notes = $6, 
            heart_notes = $7, 
            base_notes = $8, 
            description = $9, 
            image = $10 
        WHERE id = $11 
        RETURNING *`,
        [name, brand, launch_date, perfumers, notes, top_notes, heart_notes, base_notes, description, image, id]
    );
    return result.rows[0];
};

const deleteFragrance = async (id) => {
    const result = await pool.query(
        `DELETE FROM fragrances 
        WHERE id = $1 
        RETURNING *`,
        [id]
    );
    return result.rows[0];
};

module.exports = {
    getAllUsers,
    updateUser,
    promoteUserToAdmin,
    demoteUserFromAdmin,
    deleteUser,
    getAllReviews,
    updateReview,
    deleteReview,
    createFragrance,
    getAllFragrances,
    updateFragrance,
    deleteFragrance
};
