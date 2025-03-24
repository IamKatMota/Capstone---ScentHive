const pool =require("../db/db");

// Add a fragrance to a user’s list (Collection, Wishlist, Disliked, etc.)
const addToUserFragranceList = async (table, user_id, fragrance_id) => {
    const result = await pool.query(
        `INSERT INTO ${table} (user_id, fragrance_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, fragrance_id) DO NOTHING
        RETURNING *`,
        [user_id, fragrance_id]
        );
    return result.rows[0];
    
};

// Get all fragrances from a user’s list
const getUserFragranceList = async (table, user_id) => {
    const result = await pool.query(
        `SELECT f.* FROM fragrances f
        JOIN ${table} ufl ON f.id = ufl.fragrance_id
        WHERE ufl.user_id = $1`,
        [user_id]
    );
    return result.rows;
    
};

// Remove a fragrance from a user’s list
const removeFromUserFragranceList = async (tableName, user_id, fragrance_id) => {
    const result = await pool.query(
        `DELETE FROM ${tableName}
        WHERE user_id = $1 AND fragrance_id = $2
        RETURNING *`,
        [user_id, fragrance_id]
    );
    return result.rows[0];
};

module.exports = {
    addToUserFragranceList,
    getUserFragranceList,
    removeFromUserFragranceList
};