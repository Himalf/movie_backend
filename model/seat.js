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
    let query = `
      SELECT seats.*, showtimes.*, theaters.*, movies.*
      FROM seats
      JOIN showtimes ON seats.showtime_id = showtimes.showtimeid
      JOIN theaters ON seats.theater_id = theaters.theaterid
      JOIN movies ON showtimes.movie_id = movies.movieid
      WHERE showtimes.showtimeid = ?`;
    return db.execute(query, [showtime_id]);
  }

  static getSeatsByMovieAndShowtime(movie_id, showtime_id) {
    let query = `
      SELECT seats.*, showtimes.*, theaters.*, movies.*
      FROM seats
      JOIN showtimes ON seats.showtime_id = showtimes.showtimeid
      JOIN theaters ON seats.theater_id = theaters.theaterid
      JOIN movies ON showtimes.movie_id = movies.movieid
      WHERE showtimes.movie_id = ? AND showtimes.showtimeid = ?`;
    return db.execute(query, [movie_id, showtime_id]);
  }

  static getSeatsByDateAndTime(show_date, show_time) {
    let query = `
      SELECT seats.*, showtimes.*, theaters.*, movies.*
      FROM seats
      JOIN showtimes ON seats.showtime_id = showtimes.showtimeid
      JOIN theaters ON seats.theater_id = theaters.theaterid
      JOIN movies ON showtimes.movie_id = movies.movieid
      WHERE showtimes.show_date = ? AND showtimes.show_time = ?`;
    return db.execute(query, [show_date, show_time]);
  }

  static updateSeatStatus(seat_id, status) {
    let query = `UPDATE seats SET status = ? WHERE seatid = ?`;
    return db.execute(query, [status, seat_id]);
  }

  static deleteSeat(seat_id) {
    let query = `DELETE FROM seats WHERE seatid = ?`;
    return db.execute(query, [seat_id]);
  }

  static deleteSeatsBeforeCurrentTime() {
    let query = `
      DELETE seats
      FROM seats
      JOIN showtimes ON seats.showtime_id = showtimes.showtimeid
      WHERE showtimes.show_date < CURDATE() OR
            (showtimes.show_date = CURDATE() AND showtimes.show_time < CURTIME())`;
    return db.execute(query);
  }

  static getSeatById(seat_id) {
    let query = `
      SELECT seats.*, showtimes.*, theaters.*, movies.*
      FROM seats
      JOIN showtimes ON seats.showtime_id = showtimes.showtimeid
      JOIN theaters ON seats.theater_id = theaters.theaterid
      JOIN movies ON showtimes.movie_id = movies.movieid
      WHERE seats.seatid = ?`;
    return db.execute(query, [seat_id]);
  }

  static getAllSeats() {
    let query = `
      SELECT seats.*, showtimes.*, theaters.*, movies.*
      FROM seats
      JOIN showtimes ON seats.showtime_id = showtimes.showtimeid
      JOIN theaters ON seats.theater_id = theaters.theaterid
      JOIN movies ON showtimes.movie_id = movies.movieid
      ORDER BY seats.seat_number ASC`;
    return db.execute(query);
  }
}

module.exports = SEAT;
