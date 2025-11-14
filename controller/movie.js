const AppDataSource = require("../config/data-source");
const MovieRepository = require("../repository/MovieRepository");

exports.createMovieController = async (req, res) => {
  try {
    const { title, description, releasedate, duration, moviecategoryid } =
      req.body;
    const poster = req.file ? req.file.filename : null;

    const movieRepository = AppDataSource.getRepository("Movie");
    const newMovie = movieRepository.create({
      title,
      description,
      releasedate,
      duration,
      moviecategoryid,
      poster,
    });

    const savedMovie = await movieRepository.save(newMovie);
    return res.status(200).json({
      createRecord: savedMovie,
      msg: "Movie created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getNowShowingMoviesController = async (req, res) => {
  try {
    const movies = await MovieRepository.getMoviesNowShowing();
    return res.status(200).json(movies);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getNextReleaseMoviesController = async (req, res) => {
  try {
    const movies = await MovieRepository.getMoviesNextRelease();
    return res.status(200).json(movies);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateMovieController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, releasedate, duration, moviecategoryid } =
      req.body;
    const poster = req.file ? req.file.filename : null;

    const movieRepository = AppDataSource.getRepository("Movie");
    const movie = await movieRepository.findOne({
      where: { movieid: parseInt(id) },
    });

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    movieRepository.merge(movie, {
      title,
      description,
      releasedate,
      duration,
      moviecategoryid,
      poster: poster || movie.poster,
    });

    const updatedMovie = await movieRepository.save(movie);
    return res.status(200).json({
      updateRecord: updatedMovie,
      msg: "Movie updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteMovieController = async (req, res) => {
  try {
    const { id } = req.params;
    const movieRepository = AppDataSource.getRepository("Movie");
    const movie = await movieRepository.findOne({
      where: { movieid: parseInt(id) },
    });

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    await movieRepository.remove(movie);
    return res.status(200).json({
      msg: "Movie deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getMovieByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const movieRepository = AppDataSource.getRepository("Movie");
    const movie = await movieRepository.findOne({
      where: { movieid: parseInt(id) },
      relations: ["moviecategory"],
    });

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    return res.status(200).json(movie);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
