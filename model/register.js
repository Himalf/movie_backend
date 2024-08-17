const db = require("../config/db");

class REGISTER {
  constructor(userid, fullname, email, password, dateofbirth) {
    this.userid = userid || null;
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
  static findAll() {
    const sql = `select * from register_user`;
    return db.execute(sql);
  }

  static findByEmail(email) {
    const sql = "SELECT * FROM register_user WHERE email=?";
    return db.execute(sql, [email]);
  }

  static findById(userid) {
    const sql = "SELECT * FROM register_user WHERE userid=?";
    return db.execute(sql, [userid]);
  }

  update(userid) {
    const sql = `UPDATE register_user SET fullname=?, email=?, password=?, dateofbirth=? WHERE userid=?`;
    return db.execute(sql, [
      this.fullname,
      this.email,
      this.password,
      this.dateofbirth,
      userid,
    ]);
  }

  static deleteUser(userid) {
    const sql = "DELETE FROM register_user WHERE userid=?";
    return db.execute(sql, [userid]);
  }
}

module.exports = REGISTER;
