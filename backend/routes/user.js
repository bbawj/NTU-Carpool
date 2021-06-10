const router = require("express").Router();
const User = require("../models/User");
const Ride = require("../models/Ride");
const Joi = require("joi");
//jwt middleware
const verifyToken = require("../middleware/verifyToken");

//validate with joi
const schema = Joi.object({
  pickup: Joi.string(),
  dropoff: Joi.string(),
  pickupTime: Joi.date().required(),
  dropoffTime: Joi.date().greater(Joi.ref("pickup")).required(),
  seats: Joi.number().min(1).max(6).required(),
  price: Joi.number().min(0).required(),
});

router.get("/", verifyToken, (req, res) => {
  const now = new Date().toISOString();
  const query = Ride.find({}).where("pickupTime").gt(now);
  query.exec((err, data) => {
    if (err) return res.send(err);
    res.send(data);
  });
});

router.post("/add", verifyToken, async (req, res) => {
  //validate data
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //get username from DB
  const username = await User.findById(req.user._id).username;
  if (!username) return res.status(400).send("User not found");

  const ride = new Ride({
    username: username,
    pickup: req.body.pickup,
    dropoff: req.body.dropoff,
    pickupTime: req.body.pickupTime,
    dropoffTime: req.body.dropoffTime,
    seats: req.body.seats,
    price: req.body.price,
  });
  try {
    await ride.save();
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
