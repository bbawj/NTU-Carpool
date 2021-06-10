const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    pickup: {
      type: String,
      required: true,
    },
    pickupTime: {
      type: Date,
      required: true,
    },
    dropoffTime: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    seats: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ride", rideSchema);
