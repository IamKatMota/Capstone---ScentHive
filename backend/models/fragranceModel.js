const pool = require("../db/db");

//fetch all fragrances 

const getAllFragrances = async () => {
    const result = await pool.query("SELECT * FROM fragrances");
    return result.rows;
}

// Fetch a single fragrance by ID
const getFragranceById = async (id) => {
    const result = await pool.query("SELECT * FROM fragrances WHERE id = $1", [id]);
    return result.rows[0];
}

// Add a new fragrance (Admin only)
const addFragrance = async ({ name, brand, launch_date, perfumers, notes, top_notes, heart_notes, base_notes, description, image }) => {
    const result = await pool.query(
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
            $10)
        RETURNING *`,
        [name, brand, launch_date, perfumers, notes, top_notes, heart_notes, base_notes, description, image]
    );
    return result.rows[0];
}

// Update fragrance details (Admin only)
const updateFragrance = async (id, { name, brand, launch_date, perfumers, top_notes, heart_notes, base_notes, description, image }) => {
    const result = await pool.query(
        `UPDATE fragrances
        SET name = $1, brand = $2, launch_date = $3, perfumers = $4, notes = $5, top_notes =$6, heart_notes =$7,base_notes = $8, description = $9, image = $10
        WHERE id = $11
        RETURNING *`,
        [name, brand, launch_date, perfumers, notes, top_notes, heart_notes, base_notes, description, image, id]
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
//%${q.toLowerCase()}% Allows partial matches like "Dior" matching "Dior Sauvage".
//unnest breaks array into a list of rows
const searchFragrances = async (q) => {
    const searchTerm = `%${q.toLowerCase()}%`; 

    const result = await pool.query(
        `SELECT * FROM fragrances
        WHERE unaccent(LOWER(name)) LIKE unaccent($1)
        OR unaccent(LOWER(brand)) LIKE unaccent($1)
        OR EXISTS (SELECT 1 FROM unnest(perfumers) AS p WHERE unaccent(LOWER(p)) LIKE unaccent($1))
        OR EXISTS (SELECT 1 FROM unnest(notes) AS n WHERE unaccent(LOWER(n)) LIKE unaccent($1))
        OR EXISTS (SELECT 1 FROM unnest(top_notes) AS t WHERE unaccent(LOWER(t)) LIKE unaccent($1))
        OR EXISTS (SELECT 1 FROM unnest(heart_notes) AS h WHERE unaccent(LOWER(h)) LIKE unaccent($1))
        OR EXISTS (SELECT 1 FROM unnest(base_notes) AS b WHERE unaccent(LOWER(b)) LIKE unaccent($1))`,
        [searchTerm]
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