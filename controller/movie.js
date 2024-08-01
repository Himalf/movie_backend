const MOVIE = require("../model/movie");

exports.createMovieController = async (req, res) => {
  try {
    const { title, description, releasedate, duration, moviecategoryid } =
      req.body;
    const poster = req.file ? req.file.filename : null;

    const movieModel = new MOVIE(
      title,
      description,
      releasedate,
      duration,
      moviecategoryid,
      poster
    );
    const createRecord = await movieModel.create();
    return res.status(200).json({
      createRecord,
      msg: "Movie created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getNowShowingMoviesController = async (req, res) => {
  try {
    const nowShowingMovies = await MOVIE.getMoviesNowShowing();
    return res.status(200).json(nowShowingMovies[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getNextReleaseMoviesController = async (req, res) => {
  try {
    const nextReleaseMovies = await MOVIE.getMoviesNextRelease();
    return res.status(200).json(nextReleaseMovies[0]);
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

    const movieModel = new MOVIE(
      title,
      description,
      releasedate,
      duration,
      moviecategoryid,
      poster
    );
    const updateRecord = await movieModel.updateMovie(id);
    return res.status(200).json({
      updateRecord,
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
    const deleteRecord = await MOVIE.deleteMovie(id);
    return res.status(200).json({
      deleteRecord,
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
    const movie = await MOVIE.getMovieById(id);
    return res.status(200).json(movie[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
