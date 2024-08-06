const SHOWTIME = require("../model/show_time");

exports.createShowtimeController = async (req, res) => {
  try {
    const { movie_id, theater_id, show_date, show_time } = req.body;
    const showtimeModel = new SHOWTIME(
      movie_id,
      theater_id,
      show_date,
      show_time
    );
    const createRecord = await showtimeModel.create();
    return res.status(200).json({
      createRecord,
      msg: "Showtime created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getShowtimesByMovieIdController = async (req, res) => {
  try {
    const { movie_id } = req.params;
    const showtimes = await SHOWTIME.getShowtimesByMovieId(movie_id);
    return res.status(200).json(showtimes[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getShowtimesByTheaterIdController = async (req, res) => {
  try {
    const { theater_id } = req.params;
    const showtimes = await SHOWTIME.getShowtimesByTheaterId(theater_id);
    return res.status(200).json(showtimes[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getShowtimesByMovieAndTheaterController = async (req, res) => {
  try {
    const { movie_id, theater_id } = req.params;
    const showtimes = await SHOWTIME.getShowtimesByMovieAndTheater(
      movie_id,
      theater_id
    );
    return res.status(200).json(showtimes[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getShowtimeByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const showtime = await SHOWTIME.getShowtimeById(id);
    return res.status(200).json(showtime[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateShowtimeController = async (req, res) => {
  try {
    const { id } = req.params;
    const { movie_id, theater_id, show_date, show_time } = req.body;
    const showtimeModel = new SHOWTIME(
      movie_id,
      theater_id,
      show_date,
      show_time
    );
    const updateRecord = await showtimeModel.updateShowtime(id);
    return res.status(200).json({
      updateRecord,
      msg: "Showtime updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteShowtimeController = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteRecord = await SHOWTIME.deleteShowtime(id);
    return res.status(200).json({
      deleteRecord,
      msg: "Showtime deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllShowtimesController = async (req, res) => {
  try {
    const showtimes = await SHOWTIME.getAllShowtimes();
    return res.status(200).json(showtimes[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getShowtimesByTheaterMovieAndDateController = async (req, res) => {
  try {
    const { theater_id, movie_id, show_date } = req.params;
    const showtimes = await SHOWTIME.getShowtimesByTheaterMovieAndDate(
      theater_id,
      movie_id,
      show_date
    );
    return res.status(200).json(showtimes[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
