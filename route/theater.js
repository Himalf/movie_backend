const express = require("express");
const router = express.Router();

// Import the theater controller
const {
  createTheaterController,
  updateTheaterController,
  deleteTheaterController,
  getAllTheatersController,
  getTheaterByIdController,
} = require("../controller/theater");

// Define the routes for theater operations

// Create a new theater
router.post("/", createTheaterController);

// Get all theaters
router.get("/", getAllTheatersController);

// Get a theater by ID
router.get("/:id", getTheaterByIdController);

// Update a theater by ID
router.put("/:id", updateTheaterController);

// Delete a theater by ID
router.delete("/:id", deleteTheaterController);

module.exports = router;
