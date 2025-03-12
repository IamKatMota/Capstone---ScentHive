const pool = require("../db/db");

const requireAdmin = async (req, res, next) =>{
    try {
        const userId = req.user?.id //get user id from authenitcation request

        if (!userId){
            return res.status(401).jsos({error: "Unauthorized: No user ID found."});
        }
        const user = await pool.query("SELECT is_admin FROM users WHERE id = $1", [userId]);

        if (user.rows.length === 0 || !user.rows[0].is_admin) {
            return res.status(403).json({error: "Forbidden: Admin access required."});
        }
        
        next(); //user is an admin, proceed
    } catch (error) {
        console.error("Error checking admin status:", error);
        res.status(500).json({error: "Internal Server Error"})
    }
};

module.exports = requireAdmin;