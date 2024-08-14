const express = require("express");
const {
  createSeatController,
  getSeatsByShowtimeController,
  getSeatsByMovieAndShowtimeController,
  getSeatsByDateAndTimeController,
  updateSeatStatusController,
  deleteSeatController,
  getSeatByIdController,
  getAllSeatsController,
} = require("../controller/seat");

const router = express.Router();

// Create seats
router.post("/", createSeatController);

// Get seats by showtime_id
router.get("/:showtime_id", getSeatsByShowtimeController);

// Get seats by movie_id and showtime_id
router.get(
  "/movie/:movie_id/showtime/:showtime_id",
  getSeatsByMovieAndShowtimeController
);

// Get seats by date and time
router.get("/date/:show_date/time/:show_time", getSeatsByDateAndTimeController);

// Update seat status by seat_id
router.put("/:seatid", updateSeatStatusController);

// Delete seat by seat_id
router.delete("/:seatid", deleteSeatController);

// Get seat by seat_id
router.get("/seat/:seatid", getSeatByIdController);

// Get all seats
router.get("/", getAllSeatsController);

module.exports = router;
