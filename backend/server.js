const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

//cors parser session middleware
app.use(cors());
app.use(express.json());

//connect to db
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => console.log("Connected to DB")
);
mongoose.set("useCreateIndex", true);

//import routes
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");

//use auth route
app.use("/user", authRoute);
app.use("/ride", userRoute);
//use auth middleware
const verifyToken = require("./middleware/verifyToken");

app.get("/api/data", verifyToken, (req, res) => {
  res.send(req.user._id);
});

app.listen(port, () => console.log(`Server running on port ${port}`));
