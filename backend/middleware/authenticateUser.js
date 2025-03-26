require("dotenv").config();

const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({error: "Unauthorized: No token provided."});
    }

    const token = authHeader.split(" ")[1]; //seperate token from Bearer keyword

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);//decode and verify token using secret key in env
        req.user = {
            id: decoded.id,
            name: decoded.name,
            is_admin: decoded.is_admin} //attach user info to request object
        next();
    } catch (error) {
        return res.status(403).json({error: "Forbidden: invalid token"});
    }
};

module.exports = authenticateUser;