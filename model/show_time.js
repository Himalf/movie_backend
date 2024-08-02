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
    let query = `SELECT * FROM showtimes WHERE movie_id = ?`;
    return db.execute(query, [movie_id]);
  }

  static getShowtimesByTheaterId(theater_id) {
    let query = `SELECT * FROM showtimes WHERE theater_id = ?`;
    return db.execute(query, [theater_id]);
  }

  static getShowtimeById(showtimeid) {
    let query = `SELECT * FROM showtimes WHERE showtimeid = ?`;
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
    let query = `SELECT * FROM showtimes ORDER BY show_date DESC, show_time DESC`;
    return db.execute(query);
  }
}

module.exports = SHOWTIME;
