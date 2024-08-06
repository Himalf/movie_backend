const express = require("express");
const {
  createShowtimeController,
  getShowtimesByMovieIdController,
  getShowtimesByTheaterIdController,
  getShowtimesByMovieAndTheaterController,
  getShowtimeByIdController,
  updateShowtimeController,
  deleteShowtimeController,
  getAllShowtimesController,
  getShowtimesByTheaterMovieAndDateController,
} = require("../controller/show_time");

const router = express.Router();

// Create a new showtime
router.post("/", createShowtimeController);

// Get showtimes by movie ID
router.get("/movie/:movie_id", getShowtimesByMovieIdController);

// Get showtimes by theater ID
router.get("/theater/:theater_id", getShowtimesByTheaterIdController);

// Get showtimes by movie ID and theater ID
router.get(
  "/movie/:movie_id/theater/:theater_id",
  getShowtimesByMovieAndTheaterController
);

// Get showtime by ID
router.get("/:id", getShowtimeByIdController);

// Update a showtime
router.patch("/:id", updateShowtimeController);

// Delete a showtime
router.delete("/:id", deleteShowtimeController);

// Get all showtimes
router.get("/", getAllShowtimesController);

// Get showtimes by theater ID, movie ID, and date
router.get(
  "/theater/:theater_id/movie/:movie_id/date/:show_date",
  getShowtimesByTheaterMovieAndDateController
);

module.exports = router;
