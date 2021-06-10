const router = require("express").Router();
const User = require("../models/User");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/verifyToken");
const Ride = require("../models/Ride");

//validate with joi
const schema = Joi.object({
  username: Joi.string().min(6).required(),
  password: Joi.string().min(6).required(),
});

router.post("/register", async (req, res) => {
  //validate data
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if user already exists from db
  const userExists = await User.findOne({ username: req.body.username });
  if (userExists) return res.status(400).send("Username already exists");

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //create new user
  const user = new User({
    username: req.body.username,
    password: hashedPassword,
  });

  try {
    const newUser = await user.save();
    res.send({ id: newUser._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  //check if user registered
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send("User not found");

  //check if password valid
  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(400).send("Invalid password");

  //assign JWT
  const accessToken = jwt.sign(
    { _id: user.id },
    process.env.ACCESS_TOKEN_SECRET
  );
  res.json({ accessToken: accessToken });
});

router.get("/isauth", verifyToken, (req, res) => {
  try {
    if (!req.user) {
      return res.sendStatus(403);
    }
    res.json({ id: req.user._id });
  } catch {
    return res.sendStatus(403);
  }
});

router.get("/:userID", verifyToken, async (req, res) => {
  //validate if request is from current user
  if (req.user._id !== req.params.userID) return res.status(401);
  //validate if user exists
  const user = await User.findOne({ _id: req.user._id });
  if (!user) return res.status(400).send("User not found");
  const query = Ride.find({ username: user.username });
  query.exec((err, data) => {
    if (err) return res.status(500).json({ error: err.code });
    res.json(
      //sort by latest ride first
      data.sort((a, b) => {
        return a.pickupTime < b.pickupTime
          ? 1
          : a.pickupTime > b.pickupTime
          ? -1
          : 0;
      })
    );
  });
});

module.exports = router;
