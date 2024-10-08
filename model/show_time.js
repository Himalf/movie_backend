const db = require("../config/db");
const SEAT = require("../model/seat");
class SHOWTIME {
  constructor(movie_id, theater_id, show_date, show_time) {
    this.movie_id = movie_id;
    this.theater_id = theater_id;
    this.show_date = show_date;
    this.show_time = show_time;
  }

  static async isShowtimeDuplicate(movie_id, theater_id, show_date, show_time) {
    let query = `
      SELECT COUNT(*) as count 
      FROM showtimes 
      WHERE movie_id = ? 
        AND theater_id = ? 
        AND show_date = ? 
        AND show_time = ?`;

    const [result] = await db.execute(query, [
      movie_id,
      theater_id,
      show_date,
      show_time,
    ]);
    return result[0].count > 0;
  }

  async create() {
    // Check for duplicate showtime before creating
    const isDuplicate = await SHOWTIME.isShowtimeDuplicate(
      this.movie_id,
      this.theater_id,
      this.show_date,
      this.show_time
    );
    if (isDuplicate) {
      throw new Error(
        "Showtime already exists for the same movie, theater, date, and time."
      );
    }

    let sql = `INSERT INTO showtimes (movie_id, theater_id, show_date, show_time) VALUES (?, ?, ?, ?)`;

    const [result] = await db.execute(sql, [
      this.movie_id,
      this.theater_id,
      this.show_date,
      this.show_time,
    ]);

    const showtime_id = result.insertId;

    // Automatically generate and insert seats for the new showtime
    await this.createSeatsForShowtime(showtime_id);

    return result;
  }

  async createSeatsForShowtime(showtime_id) {
    const rows = 10; // Number of rows
    const seatsPerRow = 10; // Number of seats per row
    const seatNumbers = [];

    for (let row = 1; row <= rows; row++) {
      for (let seat = 1; seat <= seatsPerRow; seat++) {
        seatNumbers.push(`${String.fromCharCode(64 + row)}${seat}`);
      }
    }

    const seatCreationPromises = seatNumbers.map((seat_number) =>
      new SEAT(seat_number, "available", showtime_id).create()
    );

    await Promise.all(seatCreationPromises);
  }

  static getShowtimesByMovieId(movie_id) {
    let query = `
      SELECT showtimes.*, movies.*, theaters.*
      FROM showtimes
      JOIN movies ON showtimes.movie_id = movies.movieid
      JOIN theaters ON showtimes.theater_id = theaters.theaterid
      WHERE showtimes.movie_id = ?`;
    return db.execute(query, [movie_id]);
  }

  static getShowtimesByTheaterId(theater_id) {
    let query = `
      SELECT showtimes.*, movies.*, theaters.*
      FROM showtimes
      JOIN movies ON showtimes.movie_id = movies.movieid
      JOIN theaters ON showtimes.theater_id = theaters.theaterid
      WHERE showtimes.theater_id = ?`;
    return db.execute(query, [theater_id]);
  }

  static getShowtimesByMovieAndTheater(movie_id, theater_id) {
    let query = `
      SELECT showtimes.*, movies.*, theaters.*
      FROM showtimes
      JOIN movies ON showtimes.movie_id = movies.movieid
      JOIN theaters ON showtimes.theater_id = theaters.theaterid
      WHERE showtimes.movie_id = ? AND showtimes.theater_id = ?`;
    return db.execute(query, [movie_id, theater_id]);
  }

  static getShowtimeById(showtimeid) {
    let query = `
      SELECT showtimes.*, movies.*, theaters.*
      FROM showtimes
      JOIN movies ON showtimes.movie_id = movies.movieid
      JOIN theaters ON showtimes.theater_id = theaters.theaterid
      WHERE showtimes.showtimeid = ?`;
    return db.execute(query, [showtimeid]);
  }

  updateShowtime(showtimeid) {
    let query = `UPDATE showtimes SET movie_id = ?, theater_id = ?, show_date = ?, show_time = ? WHERE showtimeid = ?`;
    return db.execute(query, [
      this.movie_id,
      this.theater_id,
      this.show_date,
      this.show_time,
      showtimeid,
    ]);
  }

  static deleteShowtime(showtimeid) {
    let query = `DELETE FROM showtimes WHERE showtimeid = ?`;
    return db.execute(query, [showtimeid]);
  }

  static getAllShowtimes() {
    let query = `
      SELECT showtimes.*, movies.*, theaters.*
      FROM showtimes
      JOIN movies ON showtimes.movie_id = movies.movieid
      JOIN theaters ON showtimes.theater_id = theaters.theaterid
      ORDER BY showtimes.show_date DESC, showtimes.show_time DESC`;
    return db.execute(query);
  }

  static getShowtimesByTheaterMovieAndDate(theater_id, movie_id, show_date) {
    let query = `
      SELECT showtimes.*, movies.*, theaters.*
      FROM showtimes
      JOIN movies ON showtimes.movie_id = movies.movieid
      JOIN theaters ON showtimes.theater_id = theaters.theaterid
      WHERE showtimes.theater_id = ?
        AND showtimes.movie_id = ?
        AND showtimes.show_date = ?`;
    return db.execute(query, [theater_id, movie_id, show_date]);
  }
  static deleteExpiredShowtimes() {
    const currentDateTime = new Date();
    const query = `
      DELETE FROM showtimes
      WHERE show_date < ?
      OR (show_date = ? AND show_time < ?)`;
    return db.execute(query, [
      currentDateTime.toISOString().split("T")[0],
      currentDateTime.toISOString().split("T")[0],
      currentDateTime.toTimeString().split(" ")[0],
    ]);
  }
}

module.exports = SHOWTIME;
