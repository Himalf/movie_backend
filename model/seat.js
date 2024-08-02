const db = require("../config/db");

class SEAT {
  constructor(seat_number, status, showtime_id, theater_id) {
    this.seat_number = seat_number;
    this.status = status;
    this.showtime_id = showtime_id;
    this.theater_id = theater_id;
  }

  create() {
    let sql = `INSERT INTO seats (seat_number, status, showtime_id, theater_id) VALUES (?, ?, ?, ?)`;
    return db.execute(sql, [
      this.seat_number,
      this.status,
      this.showtime_id,
      this.theater_id,
    ]);
  }

  static getSeatsByShowtime(showtime_id) {
    let query = `SELECT * FROM seats WHERE showtime_id = ?`;
    return db.execute(query, [showtime_id]);
  }

  static getSeatsByMovieAndShowtime(movie_id, showtime_id) {
    let query = `
      SELECT seats.*
      FROM seats
      JOIN showtimes ON seats.showtime_id = showtimes.showtimeid
      WHERE showtimes.movie_id = ? AND showtimes.showtimeid = ?`;
    return db.execute(query, [movie_id, showtime_id]);
  }

  static getSeatsByDateAndTime(show_date, show_time) {
    let query = `
      SELECT seats.*
      FROM seats
      JOIN showtimes ON seats.showtime_id = showtimes.showtimeid
      WHERE showtimes.show_date = ? AND showtimes.show_time = ?`;
    return db.execute(query, [show_date, show_time]);
  }

  static updateSeatStatus(seatid, status) {
    let query = `UPDATE seats SET status = ? WHERE seatid = ?`;
    return db.execute(query, [status, seatid]);
  }

  static deleteSeat(seatid) {
    let query = `DELETE FROM seats WHERE seatid = ?`;
    return db.execute(query, [seatid]);
  }

  static getSeatById(seatid) {
    let query = `SELECT * FROM seats WHERE seatid = ?`;
    return db.execute(query, [seatid]);
  }

  static getAllSeats() {
    let query = `SELECT * FROM seats ORDER BY seat_number ASC`;
    return db.execute(query);
  }
}

module.exports = SEAT;
