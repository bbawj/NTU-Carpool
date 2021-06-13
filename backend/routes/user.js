const router = require("express").Router();
const User = require("../models/User");
const Ride = require("../models/Ride");
const Joi = require("joi").extend(require("@joi/date"));
//jwt middleware
const verifyToken = require("../middleware/verifyToken");

//validate with joi
const schema = Joi.object({
  userid: Joi.string(),
  pickup: Joi.string(),
  dropoff: Joi.string(),
  pickupTime: Joi.date().min("now").format("YYYY-MM-DD HH:mm").required(),
  seats: Joi.number().min(1).max(6).required(),
  price: Joi.number().min(0).required(),
});
// GET rides
router.get("/", verifyToken, (req, res) => {
  const now = new Date().toISOString();
  const { pickup, dropoff } = req.query;
  let params = {};
  if (pickup) params.pickup = pickup;
  if (dropoff) params.dropoff = dropoff;
  const query = Ride.find(params).where("pickupTime").gt(now);
  query.exec((err, data) => {
    if (err) return res.status(500).json({ error: err.code });
    res.json(
      //sort by earliest ride first
      data.sort((a, b) => {
        return a.pickupTime < b.pickupTime
          ? -1
          : a.pickupTime > b.pickupTime
          ? 1
          : 0;
      })
    );
  });
});
// POST new ride
router.post("/add", verifyToken, async (req, res) => {
  //validate data
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //get username from DB
  const query = await User.findById(req.body.userid);
  const username = query.username;
  if (!username) return res.status(400).send("User not found");

  const ride = new Ride({
    username: username,
    pickup: req.body.pickup,
    dropoff: req.body.dropoff,
    pickupTime: req.body.pickupTime,
    seats: req.body.seats,
    price: req.body.price,
  });
  try {
    const newRide = await ride.save();
    res.json(newRide);
  } catch (err) {
    res.status(400).send(err);
  }
});
// UPDATE ride/:id
router.patch("/:id", verifyToken, (req, res) => {
  Ride.findOneAndUpdate(
    { _id: req.params.id },
    { $addToSet: { requested: req.user._id } },
    (err, data) => {
      if (err) return res.status(500).json({ error: err.code });
      return res.status(200).send("Successful update");
    }
  );
});

module.exports = router;
