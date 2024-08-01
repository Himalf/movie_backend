const express = require("express");
const multer = require("multer");
const {
  createMovieController,
  getNowShowingMoviesController,
  getNextReleaseMoviesController,
  updateMovieController,
  deleteMovieController,
  getMovieByIdController,
} = require("../controller/movie");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Create a new movie
router.post("/", upload.single("poster"), createMovieController);

// Get movies currently showing
router.get("/now-showing", getNowShowingMoviesController);

// Get movies that will be released next
router.get("/next-release", getNextReleaseMoviesController);

// Update a movie
router.patch("/:id", upload.single("poster"), updateMovieController);

// Delete a movie
router.delete("/:id", deleteMovieController);

// Get a movie by ID
router.get("/:id", getMovieByIdController);

module.exports = router;
