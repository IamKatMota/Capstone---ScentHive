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
const addFragrance = async ({ name, brand, launch_date, perfumers, notes, description, image }) => {
    const result = await pool.query(
        `INSERT INTO fragrances (
            id,
            name,
            brand,
            launch_date,
            perfumers,
            notes,
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
            $7)
        RETURNING *`, 
        [name, brand, launch_date, perfumers, notes, description, image]
    );
    return result.rows[0];
}

// Update fragrance details (Admin only)
const updateFragrance = async (id, { name, brand, launch_date, perfumers, notes, description, image }) => {
    const result = await pool.query(
        `UPDATE fragrances
        SET name = $1, brand = $2, launch_date = $3, perfumers = $4, notes = $5, description = $6, image = $7
        WHERE id = $8
        RETURNING *`,
        [name, brand, launch_date, perfumers, notes, description, image, id]
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
};

// Function to search fragrances by name, brand, perfumer, or notes
const searchFragrances = async (q) => {
    const result = await pool.query(
        `SELECT * FROM fragrances 
        WHERE LOWER(name) LIKE LOWER($1) 
        OR LOWER(perfumers) LIKE LOWER($1) 
        OR LOWER(notes) LIKE LOWER($1)
        OR LOWER(brand) LIKE LOWER($1)`,
        [`%${q}%`]
    );
    return result.rows;
};


module.exports = {
    getAllFragrances,
    getFragranceById,
    addFragrance,
    updateFragrance,
    deleteFragrance,
    searchFragrances
}