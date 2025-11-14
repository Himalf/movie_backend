const AppDataSource = require("../config/data-source");

// Helper function to create seats for a showtime
async function createSeatsForShowtime(showtime_id) {
  const rows = 10; // Number of rows
  const seatsPerRow = 10; // Number of seats per row
  const seatNumbers = [];

  for (let row = 1; row <= rows; row++) {
    for (let seat = 1; seat <= seatsPerRow; seat++) {
      seatNumbers.push(`${String.fromCharCode(64 + row)}${seat}`);
    }
  }

  const seatRepository = AppDataSource.getRepository("Seat");
  const seatCreationPromises = seatNumbers.map((seat_number) => {
    const newSeat = seatRepository.create({
      seat_number,
      status: "available",
      showtime_id,
    });
    return seatRepository.save(newSeat);
  });

  await Promise.all(seatCreationPromises);
}

// Check if showtime is duplicate
async function isShowtimeDuplicate(movie_id, theater_id, show_date, show_time) {
      const showtimeRepository = AppDataSource.getRepository("ShowTime");
  const existing = await showtimeRepository.findOne({
    where: {
      movie_id: parseInt(movie_id),
      theater_id: parseInt(theater_id),
      show_date,
      show_time,
    },
  });
  return !!existing;
}

exports.createShowtimeController = async (req, res) => {
  try {
    const { movie_id, theater_id, show_date, show_time } = req.body;

    // Check if the showtime already exists
    const duplicate = await isShowtimeDuplicate(
      movie_id,
      theater_id,
      show_date,
      show_time
    );

    if (duplicate) {
      return res.status(400).json({
        error: "Showtime already exists for the specified date and time.",
      });
    }

    // Create the showtime
    const showtimeRepository = AppDataSource.getRepository("ShowTime");
    const newShowtime = showtimeRepository.create({
      movie_id: parseInt(movie_id),
      theater_id: parseInt(theater_id),
      show_date,
      show_time,
    });

    const savedShowtime = await showtimeRepository.save(newShowtime);

    // Automatically generate and insert seats for the new showtime
    await createSeatsForShowtime(savedShowtime.showtimeid);

    return res.status(200).json({
      createRecord: savedShowtime,
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
    const showtimeRepository = AppDataSource.getRepository("ShowTime");
    const showtimes = await showtimeRepository.find({
      where: { movie_id: parseInt(movie_id) },
      relations: ["movie", "theater"],
    });
    return res.status(200).json(showtimes);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getShowtimesByTheaterIdController = async (req, res) => {
  try {
    const { theater_id } = req.params;
    const showtimeRepository = AppDataSource.getRepository("ShowTime");
    const showtimes = await showtimeRepository.find({
      where: { theater_id: parseInt(theater_id) },
      relations: ["movie", "theater"],
    });
    return res.status(200).json(showtimes);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getShowtimesByMovieAndTheaterController = async (req, res) => {
  try {
    const { movie_id, theater_id } = req.params;
    const showtimeRepository = AppDataSource.getRepository("ShowTime");
    const showtimes = await showtimeRepository.find({
      where: {
        movie_id: parseInt(movie_id),
        theater_id: parseInt(theater_id),
      },
      relations: ["movie", "theater"],
    });
    return res.status(200).json(showtimes);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getShowtimeByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const showtimeRepository = AppDataSource.getRepository("ShowTime");
    const showtime = await showtimeRepository.findOne({
      where: { showtimeid: parseInt(id) },
      relations: ["movie", "theater"],
    });

    if (!showtime) {
      return res.status(404).json({ error: "Showtime not found" });
    }

    return res.status(200).json(showtime);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateShowtimeController = async (req, res) => {
  try {
    const { id } = req.params;
    const { movie_id, theater_id, show_date, show_time } = req.body;

    // Check if the updated showtime already exists (excluding current showtime)
    const duplicate = await isShowtimeDuplicate(
      movie_id,
      theater_id,
      show_date,
      show_time
    );

    if (duplicate) {
      // Check if it's the same showtime being updated
      const showtimeRepository = AppDataSource.getRepository("ShowTime");
      const existing = await showtimeRepository.findOne({
        where: {
          movie_id: parseInt(movie_id),
          theater_id: parseInt(theater_id),
          show_date,
          show_time,
        },
      });

      if (existing && existing.showtimeid !== parseInt(id)) {
        return res.status(400).json({
          error: "Showtime already exists for the specified date and time.",
        });
      }
    }

    const showtimeRepository = AppDataSource.getRepository("ShowTime");
    const showtime = await showtimeRepository.findOne({
      where: { showtimeid: parseInt(id) },
    });

    if (!showtime) {
      return res.status(404).json({ error: "Showtime not found" });
    }

    showtimeRepository.merge(showtime, {
      movie_id: parseInt(movie_id),
      theater_id: parseInt(theater_id),
      show_date,
      show_time,
    });

    const updatedShowtime = await showtimeRepository.save(showtime);
    return res.status(200).json({
      updateRecord: updatedShowtime,
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
    const showtimeRepository = AppDataSource.getRepository("ShowTime");
    const showtime = await showtimeRepository.findOne({
      where: { showtimeid: parseInt(id) },
    });

    if (!showtime) {
      return res.status(404).json({ error: "Showtime not found" });
    }

    await showtimeRepository.remove(showtime);
    return res.status(200).json({
      msg: "Showtime deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllShowtimesController = async (req, res) => {
  try {
    const showtimeRepository = AppDataSource.getRepository("ShowTime");
    const showtimes = await showtimeRepository.find({
      relations: ["movie", "theater"],
      order: {
        show_date: "DESC",
        show_time: "DESC",
      },
    });
    return res.status(200).json(showtimes);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getShowtimesByTheaterMovieAndDateController = async (req, res) => {
  try {
    const { theater_id, movie_id, show_date } = req.params;
    const showtimeRepository = AppDataSource.getRepository("ShowTime");
    const showtimes = await showtimeRepository.find({
      where: {
        theater_id: parseInt(theater_id),
        movie_id: parseInt(movie_id),
        show_date,
      },
      relations: ["movie", "theater"],
    });
    return res.status(200).json(showtimes);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Separate function to delete expired showtimes
const deleteExpiredShowtimes = async () => {
  try {
    const showtimeRepository = AppDataSource.getRepository("ShowTime");
    const currentDateTime = new Date();
    const currentDate = currentDateTime.toISOString().split("T")[0];
    const currentTime = currentDateTime.toTimeString().split(" ")[0];

    await showtimeRepository
      .createQueryBuilder()
      .delete()
      .from("ShowTime")
      .where("show_date < :currentDate", { currentDate })
      .orWhere("(show_date = :currentDate AND show_time < :currentTime)", {
        currentDate,
        currentTime,
      })
      .execute();

    console.log("Expired showtimes deleted successfully");
  } catch (error) {
    console.error("Error deleting expired showtimes:", error);
    throw error;
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

// Export for use in cron job
exports.deleteExpiredShowtimes = deleteExpiredShowtimes;
