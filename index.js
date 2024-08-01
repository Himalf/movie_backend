require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT_NEW;

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
// Start server
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
