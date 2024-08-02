const express = require("express");
const {
  createShowtimeController,
  getShowtimesByMovieIdController,
  getShowtimesByTheaterIdController,
  updateShowtimeController,
  deleteShowtimeController,
  getShowtimeByIdController,
  getAllShowtimesController,
} = require("../controller/show_time");
const router = express.Router();

// Create a new showtime
router.post("/", createShowtimeController);

// Get showtimes by movie ID
router.get("/movie/:movie_id", getShowtimesByMovieIdController);

// Get showtimes by theater ID
router.get("/theater/:theater_id", getShowtimesByTheaterIdController);

// Update a showtime
router.patch("/:id", updateShowtimeController);

// Delete a showtime
router.delete("/:id", deleteShowtimeController);

// Get a showtime by ID
router.get("/:id", getShowtimeByIdController);

// Get all showtimes
router.get("/", getAllShowtimesController);

module.exports = router;
