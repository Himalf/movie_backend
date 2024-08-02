const db = require("../config/db");

class THEATER {
  constructor(theater_name, theater_location) {
    this.theater_name = theater_name;
    this.theater_location = theater_location;
  }

  // Create a new theater record
  create() {
    let sql = `INSERT INTO theaters (theater_name, theater_location) VALUES (?, ?)`;
    return db.execute(sql, [this.theater_name, this.theater_location]);
  }

  // Update an existing theater record by ID
  update(id) {
    let sql = `UPDATE theaters SET theater_name = ?, theater_location = ? WHERE theaterid = ?`;
    return db.execute(sql, [this.theater_name, this.theater_location, id]);
  }

  // Delete a theater record by ID
  static delete(id) {
    let sql = `DELETE FROM theaters WHERE theaterid = ?`;
    return db.execute(sql, [id]);
  }

  // Get a list of all theaters
  static getAll() {
    let sql = `SELECT * FROM theaters`;
    return db.execute(sql);
  }

  // Get a theater record by ID
  static getById(id) {
    let sql = `SELECT * FROM theaters WHERE theaterid = ?`;
    return db.execute(sql, [id]);
  }
}

module.exports = THEATER;
