require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const cron = require("node-cron");
const SEAT = require("./model/seat");
const { deleteSeatsBeforeCurrentTime } = require("./controller/seat");
const { deleteExpiredShowtimes } = require("./controller/show_time");

const app = express();
const port = process.env.PORT_NEW || 3000; // Default port for development

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use(helmet()); // Security enhancements
app.use(morgan("combined")); // Logging
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
  res.send("Online Movie Booking Project");
});

// API routes
app.use("/register", require("./route/register"));
app.use("/movie_category", require("./route/movie_category"));
app.use("/movie", require("./route/movie"));
app.use("/theater", require("./route/theater"));
app.use("/showtime", require("./route/show_time"));
app.use("/seat", require("./route/seat"));
app.use("/booking", require("./route/booking"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

// Cron jobs
cron.schedule("0 0 * * *", async () => {
  try {
    await deleteSeatsBeforeCurrentTime();
    await deleteExpiredShowtimes();
    console.log("Cron job executed successfully.");
  } catch (error) {
    console.error("Error executing cron job:", error);
  }
});
