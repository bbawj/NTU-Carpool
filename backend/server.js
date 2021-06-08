const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

//cors and parser middleware
app.use(cors());
app.use(express.json());

//connect to db
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser:true, useUnifiedTopology: true  }, () => console.log('Connected to DB'));

//import routes
const authRoute = require("./routes/auth");

//use auth route
app.use("/api/user", authRoute);
//use auth middleware
const verifyToken = require('./middleware/verifyToken');

app.get("/api/data", verifyToken, (req, res) => {
    res.send(req.user._id)
} );

app.listen(port, () => console.log( `Server running on port ${port}`));