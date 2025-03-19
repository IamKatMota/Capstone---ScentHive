const express = require ("express");
const pool = require("../db/db");
const authenticateUser = require("../middleware/authenticateUser");
const requireAdmin = require("../middleware/requireAdmin");
const router = express.Router();
const {
    getAllFragrances,
    getFragranceById,
    addFragrance,
    updateFragrance,
    deleteFragrance,
    searchFragrances
} = require ("../models/fragranceModel");

//get all fragrances
router.get("/", async (req, res)=> {
    try{
        const result = await getAllFragrances();
        res.status(200).json(result);
    } catch(error){
        console.error("Error fetching fragrances:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})
// Search fragrances by name, perfumer, brand, or notes
router.get("/search", async (req, res) => {
        const { q } = req.query; // Get search query from URL
        if (!q) {
            return res.status(400).json({ error: "Search query is required" });
        }
        const result = await searchFragrances(q);

        res.status(200).json(result);
});

//get fragrances by id
router.get("/:id", async (req, res) => {
    try {
        const result = await getFragranceById(req.params.id);
        if (!result) {
            return res.status(404).json({ error: "Fragrance not found" });
        } 
        res.status(200).json(result);

    }catch (error) {
        console.error("Error fetching fragrance:", error);
        res.status(500).json({error: "internal Server Error"});
    }
});

//create a new fragrance (admin-only)
router.post("/", authenticateUser, requireAdmin,async (req, res)=> {
    try {
        const result =  await addFragrance(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({error: "Error adding fragrance."});
    }
});

//edit fragrance details (Admin-only)
router.put("/:id", authenticateUser, requireAdmin, async (req, res) => {
    try {
        const result = await updateFragrance(req.params.id, req.body);
        if (!result) {
            return res.status(404).json({ error: "Fragrance not found" });
        }
        res.status(200).json(result);
    } catch (error) {
        console.error("Error updating fragrance:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
});

//delete a fragrance (admin-only)
router.delete("/:id", authenticateUser, requireAdmin,async (req, res)=> {
    try {
        const result = await deleteFragrance(req.params.id);
        if(!result){
            res.status(404).json({message: "Fragrance not found."})
        }
        res.status(200).json(result);
        
    } catch (error) {
        res.status(500).json({error: "Error deleting fragrance."});
    }
});



module.exports = router;