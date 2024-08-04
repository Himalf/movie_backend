const db = require("../config/db");

class BOOKING {
  constructor(user_id, showtime_id, seat_id) {
    this.user_id = user_id;
    this.showtime_id = showtime_id;
    this.seat_id = seat_id;
  }

  async create() {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Insert booking
      let sql = `INSERT INTO bookings (user_id, showtime_id, seat_id) VALUES (?, ?, ?)`;
      await connection.query(sql, [
        this.user_id,
        this.showtime_id,
        this.seat_id,
      ]);

      // Update seat status
      sql = `UPDATE seats SET status = 'Booked' WHERE seatid = ?`;
      await connection.query(sql, [this.seat_id]);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error; // Re-throw error after rollback
    } finally {
      connection.release(); // Release connection back to pool
    }
  }

  async updateSeatStatus(status) {
    let query = `UPDATE seats SET status = ? WHERE seatid = ?`;
    return db.execute(query, [status, this.seat_id]);
  }

  static getBookingById(booking_id) {
    let query = `SELECT * FROM bookings WHERE bookingid = ?`;
    return db.execute(query, [booking_id]);
  }

  static getAllBookings() {
    let query = `
      SELECT *
      FROM bookings
      JOIN register_user ON bookings.user_id = register_user.userid
      JOIN showtimes ON bookings.showtime_id = showtimes.showtimeid
      JOIN seats ON bookings.seat_id = seats.seatid
      JOIN movies ON showtimes.movie_id = movies.movieid
      ORDER BY bookings.bookingid ASC`;
    return db.execute(query);
  }

  static getBookingsByUserId(user_id) {
    let query = `
      SELECT bookings.bookingid, showtimes.show_time, showtimes.show_date, 
             seats.seat_number, movies.title AS movie_title
      FROM bookings
      JOIN showtimes ON bookings.showtime_id = showtimes.showtimeid
      JOIN seats ON bookings.seat_id = seats.seatid
      JOIN movies ON showtimes.movie_id = movies.movieid
      WHERE bookings.user_id = ?
      ORDER BY bookings.bookingid ASC`;
    return db.execute(query, [user_id]);
  }

  static deleteBooking(booking_id) {
    let query = `DELETE FROM bookings WHERE bookingid = ?`;
    return db.execute(query, [booking_id]);
  }
}

module.exports = BOOKING;
