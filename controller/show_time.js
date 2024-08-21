const SHOWTIME = require("../model/show_time");

exports.createShowtimeController = async (req, res) => {
  try {
    const { movie_id, theater_id, show_date, show_time } = req.body;

    // Check if the showtime already exists
    const isDuplicate = await SHOWTIME.isShowtimeDuplicate(
      movie_id,
      theater_id,
      show_date,
      show_time
    );

    if (isDuplicate) {
      return res.status(400).json({
        error: "Showtime already exists for the specified date and time.",
      });
    }

    // Create the showtime if no duplicate exists
    const showtimeModel = new SHOWTIME(
      movie_id,
      theater_id,
      show_date,
      show_time
    );
    const createRecord = await showtimeModel.create();
    return res.status(200).json({
      createRecord,
      msg: "Showtime and seats created successfully",
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

    // Check if the updated showtime already exists
    const isDuplicate = await SHOWTIME.isShowtimeDuplicate(
      movie_id,
      theater_id,
      show_date,
      show_time
    );

    if (isDuplicate) {
      return res.status(400).json({
        error: "Showtime already exists for the specified date and time.",
      });
    }

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

// Separate function to delete expired showtimes
const deleteExpiredShowtimes = async () => {
  try {
    await SHOWTIME.deleteExpiredShowtimes();
    console.log("Expired showtimes deleted successfully");
  } catch (error) {
    console.error("Error deleting expired showtimes:", error);
    throw error; // Re-throw the error for handling in the cron job or controller
  }
};

exports.deleteExpiredShowtimesController = async (req, res) => {
  try {
    await deleteExpiredShowtimes();
    return res
      .status(200)
      .json({ msg: "Expired showtimes deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
