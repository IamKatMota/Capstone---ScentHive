const express = require("express");
const pool = require("../db/db");
const authenticateUser = require("../middleware/authenticateUser");
const { 
    addToUserFragranceList, 
    getUserFragranceList, removeFromUserFragranceList 
} = require("../models/userFragranceModel");

const router = express.Router();
const tableName = "had"; 

//add a fragrance to collection
router.post("/", authenticateUser, async(req, res) => {
    try {
        const {fragrance_id} = req.body;
        const user_id = req.user.id;

        const result = await addToUserFragranceList(tableName, user_id, fragrance_id);

        if (!result) {
            return res.status(400).json({error: "Fragrance already in collection."});
        }

        res.status(201).json({message: "Fragrance added to collection!", addedFragrance: result});
    } catch (error) {
        console.error("Error adding to collection:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
});

//get all fragrances in user's collection
router.get("/", authenticateUser, async(req,res)=> {
    try {
        const user_id = req.user.id;
        const result = await getUserFragranceList(tableName, user_id);
    res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching collection:", error);
        res.status(500).json({error: "Internal Server Errors"});
    }
});

//remove fragrance from collection
router.delete("/", authenticateUser, async(req,res)=> {
    try {
        const {fragrance_id} = req.body;
        const user_id = req.user.id;

        const result = await removeFromUserFragranceList(tableName, user_id,fragrance_id);

    if (!result){
        return res.status(404).json({error: "Fragrance not found in collection."});
    }
    res.status(200).json({message: "Fragrance deleted successfully", deletedFragrance: result});
    } catch (error) {
        console.error("Error removing from collection:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
})

module.exports = router;