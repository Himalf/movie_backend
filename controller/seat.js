const AppDataSource = require("../config/data-source");

// Helper function to generate seat numbers
function generateSeatNumbers() {
  const rows = 10; // Number of rows
  const seatsPerRow = 10; // Number of seats per row
  const seatNumbers = [];

  for (let row = 1; row <= rows; row++) {
    for (let seat = 1; seat <= seatsPerRow; seat++) {
      seatNumbers.push(`${String.fromCharCode(64 + row)}${seat}`);
    }
  }

  return seatNumbers;
}

exports.createSeatController = async (req, res) => {
  try {
    const { status, showtime_id } = req.body;

    if (!status || !showtime_id) {
      return res
        .status(400)
        .json({ error: "Status and showtime_id are required" });
    }

    // Generate seat numbers
    const seatNumbers = generateSeatNumbers();

    // Insert each seat into the database
    const seatRepository = AppDataSource.getRepository("Seat");
    const insertPromises = seatNumbers.map((seat_number) => {
      const newSeat = seatRepository.create({
        seat_number,
        status,
        showtime_id: parseInt(showtime_id),
      });
      return seatRepository.save(newSeat);
    });

    await Promise.all(insertPromises);

    return res.status(200).json({ msg: "Seats added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getSeatsByShowtimeController = async (req, res) => {
  try {
    const { showtime_id } = req.params;
    const seatRepository = AppDataSource.getRepository("Seat");
    const seats = await seatRepository.find({
      where: { showtime_id: parseInt(showtime_id) },
      relations: ["showtime", "showtime.theater", "showtime.movie"],
    });

    // Transform data to include showtime, movie, and theater info directly
    const transformedSeats = seats.map((seat) => ({
      ...seat,
      showtime: seat.showtime || null,
      movie: seat.showtime?.movie || null,
      theater: seat.showtime?.theater || null,
      movie_title: seat.showtime?.movie?.title || null,
      theater_name: seat.showtime?.theater?.theater_name || null,
      theater_location: seat.showtime?.theater?.theater_location || null,
      show_date: seat.showtime?.show_date || null,
      show_time: seat.showtime?.show_time || null,
    }));

    return res.status(200).json(transformedSeats);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getSeatsByMovieAndShowtimeController = async (req, res) => {
  try {
    const { movie_id, showtime_id } = req.params;
    const seatRepository = AppDataSource.getRepository("Seat");
    const seats = await seatRepository
      .createQueryBuilder("seat")
      .leftJoinAndSelect("seat.showtime", "showtime")
      .leftJoinAndSelect("showtime.theater", "theater")
      .leftJoinAndSelect("showtime.movie", "movie")
      .where("seat.showtime_id = :showtime_id", {
        showtime_id: parseInt(showtime_id),
      })
      .andWhere("showtime.movie_id = :movie_id", {
        movie_id: parseInt(movie_id),
      })
      .getMany();

    // Transform data to include showtime, movie, and theater info directly
    const transformedSeats = seats.map((seat) => ({
      ...seat,
      showtime: seat.showtime || null,
      movie: seat.showtime?.movie || null,
      theater: seat.showtime?.theater || null,
      movie_title: seat.showtime?.movie?.title || null,
      theater_name: seat.showtime?.theater?.theater_name || null,
      theater_location: seat.showtime?.theater?.theater_location || null,
      show_date: seat.showtime?.show_date || null,
      show_time: seat.showtime?.show_time || null,
    }));

    return res.status(200).json(transformedSeats);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getSeatsByDateAndTimeController = async (req, res) => {
  try {
    const { show_date, show_time } = req.params;
    const seatRepository = AppDataSource.getRepository("Seat");
    const seats = await seatRepository
      .createQueryBuilder("seat")
      .leftJoinAndSelect("seat.showtime", "showtime")
      .leftJoinAndSelect("showtime.theater", "theater")
      .leftJoinAndSelect("showtime.movie", "movie")
      .where("showtime.show_date = :show_date", { show_date })
      .andWhere("showtime.show_time = :show_time", { show_time })
      .getMany();

    // Transform data to include showtime, movie, and theater info directly
    const transformedSeats = seats.map((seat) => ({
      ...seat,
      showtime: seat.showtime || null,
      movie: seat.showtime?.movie || null,
      theater: seat.showtime?.theater || null,
      movie_title: seat.showtime?.movie?.title || null,
      theater_name: seat.showtime?.theater?.theater_name || null,
      theater_location: seat.showtime?.theater?.theater_location || null,
      show_date: seat.showtime?.show_date || null,
      show_time: seat.showtime?.show_time || null,
    }));

    return res.status(200).json(transformedSeats);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateSeatStatusController = async (req, res) => {
  try {
    const { seatid } = req.params;
    const { status } = req.body;
    const seatRepository = AppDataSource.getRepository("Seat");
    const seat = await seatRepository.findOne({
      where: { seatid: parseInt(seatid) },
    });

    if (!seat) {
      return res.status(404).json({ error: "Seat not found" });
    }

    seatRepository.merge(seat, { status });
    const updatedSeat = await seatRepository.save(seat);
    return res.status(200).json({
      updateRecord: updatedSeat,
      msg: "Seat status updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteSeatController = async (req, res) => {
  try {
    const { seatid } = req.params;
    const seatRepository = AppDataSource.getRepository("Seat");
    const seat = await seatRepository.findOne({
      where: { seatid: parseInt(seatid) },
    });

    if (!seat) {
      return res.status(404).json({ error: "Seat not found" });
    }

    await seatRepository.remove(seat);
    return res.status(200).json({
      msg: "Seat deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getSeatByIdController = async (req, res) => {
  try {
    const { seatid } = req.params;
    const seatRepository = AppDataSource.getRepository("Seat");
    const seat = await seatRepository.findOne({
      where: { seatid: parseInt(seatid) },
      relations: ["showtime", "showtime.theater", "showtime.movie"],
    });

    if (!seat) {
      return res.status(404).json({ error: "Seat not found" });
    }

    // Transform data to include showtime, movie, and theater info directly
    const transformedSeat = {
      ...seat,
      showtime: seat.showtime || null,
      movie: seat.showtime?.movie || null,
      theater: seat.showtime?.theater || null,
      movie_title: seat.showtime?.movie?.title || null,
      theater_name: seat.showtime?.theater?.theater_name || null,
      theater_location: seat.showtime?.theater?.theater_location || null,
      show_date: seat.showtime?.show_date || null,
      show_time: seat.showtime?.show_time || null,
    };

    return res.status(200).json(transformedSeat);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllSeatsController = async (req, res) => {
  try {
    const seatRepository = AppDataSource.getRepository("Seat");
    const seats = await seatRepository.find({
      relations: ["showtime", "showtime.theater", "showtime.movie"],
      order: {
        seat_number: "ASC",
      },
    });

    // Transform data to include showtime, movie, and theater info directly
    const transformedSeats = seats.map((seat) => ({
      ...seat,
      showtime: seat.showtime || null,
      movie: seat.showtime?.movie || null,
      theater: seat.showtime?.theater || null,
      movie_title: seat.showtime?.movie?.title || null,
      theater_name: seat.showtime?.theater?.theater_name || null,
      theater_location: seat.showtime?.theater?.theater_location || null,
      show_date: seat.showtime?.show_date || null,
      show_time: seat.showtime?.show_time || null,
    }));

    return res.status(200).json(transformedSeats);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Automatically delete seats where the showtime is before the current date and time
exports.deleteSeatsBeforeCurrentTime = async () => {
  try {
    const seatRepository = AppDataSource.getRepository("Seat");
    const showtimeRepository = AppDataSource.getRepository("ShowTime");
    const currentDateTime = new Date();
    const currentDate = currentDateTime.toISOString().split("T")[0];
    const currentTime = currentDateTime.toTimeString().split(" ")[0];

    // First, find expired showtimes
    const expiredShowtimes = await showtimeRepository
      .createQueryBuilder("showtime")
      .where("showtime.show_date < :currentDate", { currentDate })
      .orWhere(
        "(showtime.show_date = :currentDate AND showtime.show_time < :currentTime)",
        { currentDate, currentTime }
      )
      .getMany();

    if (expiredShowtimes.length > 0) {
      const expiredShowtimeIds = expiredShowtimes.map((st) => st.showtimeid);
      await seatRepository
        .createQueryBuilder()
        .delete()
        .from("Seat")
        .where("showtime_id IN (:...ids)", { ids: expiredShowtimeIds })
        .execute();
    }

    console.log("Expired seats deleted successfully.");
  } catch (error) {
    console.log("Error deleting expired seats:", error);
  }
};
