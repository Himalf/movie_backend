const db = require("../config/db");

class MOVIECATEGORY {
  constructor(categoryname) {
    this.categoryname = categoryname;
  }

  create() {
    let sql = `INSERT INTO movie_category(categoryname) VALUES('${this.categoryname}')`;
    return db.execute(sql);
  }

  static getMovieCategory() {
    let query = `SELECT * FROM movie_category`;
    return db.execute(query);
  }

  static getMovieCategoryById(id) {
    let query = `SELECT * FROM movie_category WHERE categoryid = ${id}`;
    return db.execute(query);
  }

  updateMovieCategory(id) {
    let query = `UPDATE movie_category SET categoryname = '${this.categoryname}' WHERE categoryid = ${id}`;
    return db.execute(query);
  }

  static deleteMovieCategory(id) {
    let query = `DELETE FROM movie_category WHERE categoryid = ${id}`;
    return db.execute(query);
  }
}

module.exports = MOVIECATEGORY;
