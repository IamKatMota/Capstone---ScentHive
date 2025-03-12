require("dotenv").config();

const express = require("express");
const cors = require("cors"); //allows backend to be accessible from diff domains 
const pool = require("./db/db");

//import route handlers
const fragranceRoutes = require("./routes/fragrances"); //handles all API requests for frags
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 5001;

//middleware
app.use(cors());
app.use(express.json()); //auto converts request body to js object

//API routes
app.use("/api/fragrances", fragranceRoutes); //each request starting with this endpoint is forwarded to fragranceRoutes
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);

//default route
app.get("/", (req, res) => {
    res.send("Welcome to the Scent Hive API! 🐝")
});

//start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
});


