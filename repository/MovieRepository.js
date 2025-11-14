const AppDataSource = require("../config/data-source");

class MovieRepository {
  static getRepository() {
    return AppDataSource.getRepository("Movie");
  }

  static async getMoviesNowShowing() {
    const repository = this.getRepository();
    const currentDate = new Date().toISOString().split("T")[0];
    return await repository
      .createQueryBuilder("movie")
      .leftJoinAndSelect("movie.moviecategory", "category")
      .where("movie.releasedate <= :currentDate", { currentDate })
      .orderBy("movie.releasedate", "ASC")
      .getMany();
  }

  static async getMoviesNextRelease() {
    const repository = this.getRepository();
    const currentDate = new Date().toISOString().split("T")[0];
    return await repository
      .createQueryBuilder("movie")
      .leftJoinAndSelect("movie.moviecategory", "category")
      .where("movie.releasedate > :currentDate", { currentDate })
      .orderBy("movie.releasedate", "ASC")
      .getMany();
  }

  static async getAllMovies() {
    const repository = this.getRepository();
    return await repository
      .createQueryBuilder("movie")
      .leftJoinAndSelect("movie.moviecategory", "category")
      .orderBy("movie.releasedate", "DESC")
      .getMany();
  }

  static async deleteMoviesOlderThan30Days() {
    const repository = this.getRepository();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const formattedDate = thirtyDaysAgo.toISOString().split("T")[0];

    await repository
      .createQueryBuilder()
      .delete()
      .from("Movie")
      .where("releasedate < :formattedDate", { formattedDate })
      .execute();
  }
}

module.exports = MovieRepository;

