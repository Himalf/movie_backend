require("dotenv").config();
const { DataSource } = require("typeorm");

// Import all entities
const Register = require("../entity/Register");
const MovieCategory = require("../entity/MovieCategory");
const Movie = require("../entity/Movie");
const Theater = require("../entity/Theater");
const ShowTime = require("../entity/ShowTime");
const Seat = require("../entity/Seat");
const Booking = require("../entity/Booking");

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // Set to false in production - use migrations instead
  logging: process.env.NODE_ENV === "development",
  entities: [Register, MovieCategory, Movie, Theater, ShowTime, Seat, Booking],
  migrations: [__dirname + "/../migration/*.js"],
  subscribers: [__dirname + "/../subscriber/*.js"],
});

module.exports = AppDataSource;
