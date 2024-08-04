const express = require("express");
const {
  createBookingController,
  getBookingByIdController,
  getAllBookingsController,
  getBookingsByUserIdController,
  deleteBookingController,
} = require("../controller/booking");
const router = express.Router();

// Create a new booking
router.post("/", createBookingController);

// Get booking by ID
router.get("/:booking_id", getBookingByIdController);

// Get all bookings
router.get("/", getAllBookingsController);

// Get bookings by user ID
router.get("/user/:user_id", getBookingsByUserIdController);

// Delete booking
router.delete("/:booking_id", deleteBookingController);

module.exports = router;
