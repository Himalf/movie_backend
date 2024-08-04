const db = require("../config/db");

class MOVIE {
  constructor(
    title,
    description,
    releasedate,
    duration,
    moviecategoryid,
    poster
  ) {
    this.title = title;
    this.description = description;
    this.releasedate = releasedate;
    this.duration = duration;
    this.moviecategoryid = moviecategoryid;
    this.poster = poster;
  }

  create() {
    let sql = `INSERT INTO movies (title, description, releasedate, duration, moviecategoryid, poster) VALUES (?, ?, ?, ?, ?, ?)`;
    return db.execute(sql, [
      this.title,
      this.description,
      this.releasedate,
      this.duration,
      this.moviecategoryid,
      this.poster,
    ]);
  }

  static getMoviesNowShowing() {
    const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
    let query = `SELECT movies.*, movie_category.categoryname
                     FROM movies
                     JOIN movie_category ON movies.moviecategoryid = movie_category.categoryid
                     WHERE movies.releasedate <= ?
                     ORDER BY movies.releasedate ASC
                     `;
    return db.execute(query, [currentDate]);
  }

  static getMoviesNextRelease() {
    const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
    let query = `SELECT movies.*, movie_category.categoryname
                     FROM movies
                     JOIN movie_category ON movies.moviecategoryid = movie_category.categoryid
                     WHERE movies.releasedate > ?
                     ORDER BY movies.releasedate ASC`;
    return db.execute(query, [currentDate]);
  }

  static getAllMovies() {
    let query = `SELECT movies.*, movie_category.categoryname
                     FROM movies
                     JOIN movie_category ON movies.moviecategoryid = movie_category.categoryid
                     ORDER BY movies.releasedate DESC`;
    return db.execute(query);
  }

  updateMovie(id) {
    let query = `UPDATE movies SET title = ?, description = ?, releasedate = ?, duration = ?, moviecategoryid = ?, poster = ? WHERE movieid = ?`;
    return db.execute(query, [
      this.title,
      this.description,
      this.releasedate,
      this.duration,
      this.moviecategoryid,
      this.poster,
      id,
    ]);
  }

  static deleteMovie(id) {
    let query = `DELETE FROM movies WHERE movieid = ?`;
    return db.execute(query, [id]);
  }

  static getMovieById(id) {
    let query = `SELECT movies.*, movie_category.categoryname
                     FROM movies
                     JOIN movie_category ON movies.moviecategoryid = movie_category.categoryid
                     WHERE movies.movieid = ?`;
    return db.execute(query, [id]);
  }
}

module.exports = MOVIE;
