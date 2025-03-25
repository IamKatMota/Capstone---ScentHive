const pool =require("../db/db");
const bcrypt = require("bcrypt");


// Register a user
const registerUser = async (name, email, password ) => {
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
    return result.rows[0];
    
};

// Get user by email (for login)
const getUserByEmail = async (email) => {
    const result = await pool.query(`
        SELECT * FROM users 
        WHERE email = $1`, 
        [email]
    );
    return result.rows[0];
};

// Get user by ID (for authentication)
const getUserById = async (userId) => {
    const result = await pool.query(`
        SELECT id, name, email, is_admin 
        FROM users 
        WHERE id = $1`, 
        [userId]
    );
    return result.rows[0]; 
};




module.exports = {
    registerUser,
    getUserByEmail,
    getUserById,
};