const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    username: String,
    pickup: String,
    dropoff: String,
    price: Number,
    seats: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ride", rideSchema);
