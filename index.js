require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const SEAT = require("./model/seat");
const app = express();
const port = process.env.PORT_NEW;
const cron = require("node-cron");
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
  res.send("Online Movie Booking Project");
});

// api routes handles here

app.use("/register", require("./route/register"));
app.use("/movie_category", require("./route/movie_category"));
app.use("/movie", require("./route/movie"));
app.use("/theater", require("./route/theater"));
app.use("/showtime", require("./route/show_time"));
app.use("/seat", require("./route/seat"));
app.use("/booking", require("./route/booking"));
// Start server
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
cron.schedule("0 0 * * *", async () => {
  await deleteSeatsBeforeCurrentTime();
});
