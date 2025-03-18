const pool = require("../db/db");

//fetch all fragrances 

const getAllFragrances = async() => {
    const result = await pool.query("SELECT * FROM fragrances");
    return result.rows;
}

// Fetch a single fragrance by ID
const getFragranceById = async (id) => {
    const result = await pool.query("SELECT * FROM fragrances WHERE id = $1", [id]);
    return result.rows[0];
}

// Add a new fragrance (Admin only)
const addFragrance = async ({ name, brand, launch_date, perfumers, notes, description }) => {
    const result = await pool.query(
        `INSERT INTO fragrances (
            id,
            name,
            brand,
            launch_date,
            perfumers,
            notes,
            description
        )
        VALUES (
            gen_random_uuid(), 
            $1, 
            $2, 
            $3, 
            $4, 
            $5,
            $6)
        RETURNING *`, 
        [name, brand, launch_date, perfumers, notes, description]
    );
    return result.rows[0];
}

// Update fragrance details (Admin only)
const updateFragrance = async (id, { name, brand, launch_date, perfumers, notes, description }) => {
    const result = await pool.query(
        `UPDATE fragrances
        SET name = $1, brand = $2, launch_date = $3, perfumers = $4, notes = $5, description = $6
        WHERE id = $7
        RETURNING *`,
        [name, brand, launch_date, perfumers, notes, description, id]
    );

    return result.rows[0];
}

// Delete a fragrance (Admin only)
const deleteFragrance = async (id) => {
    const result = await pool.query(
        `DELETE FROM fragrances 
        WHERE id = $1 
        RETURNING *`, 
        [id]
    );
    return result.rows[0];
}

module.exports = {
    getAllFragrances,
    getFragranceById,
    addFragrance,
    updateFragrance,
    deleteFragrance
}