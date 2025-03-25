require("dotenv").config();

const express = require("express");
const cors = require("cors"); //allows backend to be accessible from diff domains 
const pool = require("./db/db");

//import route handlers
const fragranceRoutes = require("./routes/fragrances"); 
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const wishlistRoutes = require("./routes/wishlist");
const collectionRoutes = require("./routes/collection");
const hadRoutes = require("./routes/had");
const dislikedRoutes = require("./routes/disliked");
const to_tryRoutes = require("./routes/to_try");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 5001;

//middleware
app.use(cors({
    origin: "https://scenthive.vercel.app", 
    credentials: true
}));
app.use(express.json()); //auto converts request body to js object

//API routes
app.use("/api/fragrances", fragranceRoutes); 
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/had", hadRoutes);
app.use("/api/to_try", to_tryRoutes);
app.use("/api/collection", collectionRoutes);
app.use("/api/disliked", dislikedRoutes);
app.use("/api/admin", adminRoutes);

//default route
app.get("/", (req, res) => {
    res.send("Welcome to the Scent Hive API! 🐝")
});

//start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
});


