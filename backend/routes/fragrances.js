const express = require ("express");
const pool = require("../db/db");
const router = express.Router();

//get all fragrances
router.get("/", async (req, res)=> {
    try{
        const result = await pool.query("SELECT * FROM fragrances");
        res.json(result.rows);
    } catch(error){
        console.error("Error fetching fragrances:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

//get fragrances by id
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params; //get id from url
        const result = await pool.query("SELECT ALL FROM fragrances WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Fragrance not found" });
        }
            res.json(result.rows[0]);//send only one object not an arrray
    } catch (error) {
        console.error("Error fetching fragrance:", error);
        res.status(500).json({error: "internal Server Error"});
    }
});

//create a new fragrance (admin-only)
router.post("/", async (req, res)=> {
    try {
        const {name, brand, launch_date, perfumers, notes, description} = req.body;
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
            RETURNING *`, [name, brand, launch_date, perfumers, notes, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({error: "Error adding fragrance."});
    }
});

//delete a fragrance (admin-only)
router.delete("/:id", async (req, res)=> {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "DELETE FROM fragrances WHERE id = $1 RETURNING *", [id]
        );
        res.json({message: "Fragrance deleted successfully."});
    } catch (error) {
        res.status(500).json({error: "Error deleting fragrance."});
    }
})

module.exports = router;