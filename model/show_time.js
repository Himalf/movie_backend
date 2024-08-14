const db = require("../config/db");

class SHOWTIME {
  constructor(movie_id, theater_id, show_date, show_time) {
    this.movie_id = movie_id;
    this.theater_id = theater_id;
    this.show_date = show_date;
    this.show_time = show_time;
  }

  create() {
    let sql = `INSERT INTO showtimes (movie_id, theater_id, show_date, show_time) VALUES (?, ?, ?, ?)`;
    return db.execute(sql, [
      this.movie_id,
      this.theater_id,
      this.show_date,
      this.show_time,
    ]);
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
