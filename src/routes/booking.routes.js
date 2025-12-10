const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookingStatus,
} = require("../controllers/booking.controller");

router.post("/", createBooking);
router.get("/:id", getBookingStatus);

module.exports = router;
