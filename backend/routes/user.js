const router = require("express").Router();
const User = require("../models/User");
const Ride = require("../models/Ride");
const Joi = require("joi").extend(require("@joi/date"));
//jwt middleware
const verifyToken = require("../middleware/verifyToken");

//validate with joi
const schema = Joi.object({
  ownerId: Joi.string().required(),
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
  query
    .populate("ownerId")
    .populate("riders")
    .exec((err, data) => {
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
  //validate if request is from current user
  if (req.user._id !== req.body.ownerId) return res.status(401);
  //validate data
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const ride = new Ride({
    ownerId: req.body.ownerId,
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
  if (req.body.sendRequest) {
    Ride.findOneAndUpdate(
      { _id: req.params.id },
      { $addToSet: { requested: req.user._id } },
      (err, data) => {
        if (err) return res.status(500).json({ error: err.code });
        return res.status(200).send("Successful update");
      }
    );
  } else if (req.body.acceptRequest) {
    Ride.findOneAndUpdate(
      { _id: req.params.id },
      {
        $addToSet: { riders: req.body.id },
        $pull: { requested: req.body.id },
      },
      (err, data) => {
        if (err) return res.status(500).json({ error: err.code });
        return res.status(200).send("Successful update");
      }
    );
  } else if (req.body.declineRequest) {
    Ride.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { requested: req.body.id } },
      (err, data) => {
        if (err) return res.status(500).json({ error: err.code });
        return res.status(200).send("Successful update");
      }
    );
  }
});

module.exports = router;
