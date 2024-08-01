const db = require("../config/db");

class REGISTER {
  constructor(fullname, email, password, dateofbirth) {
    this.fullname = fullname || null;
    this.email = email || null;
    this.password = password || null;
    this.dateofbirth = dateofbirth || null;
  }

  create() {
    const sql = `INSERT INTO register_user (fullname, email, password, dateofbirth) VALUES (?, ?, ?, ?)`;
    return db.execute(sql, [
      this.fullname,
      this.email,
      this.password,
      this.dateofbirth,
    ]);
  }
}

module.exports = REGISTER;
