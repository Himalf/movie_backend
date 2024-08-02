const SEAT = require("../model/seat");

exports.createSeatController = async (req, res) => {
  try {
    const { status, showtime_id, theater_id } = req.body;

    if (!status || !showtime_id || !theater_id) {
      return res
        .status(400)
        .json({ error: "Status, showtime_id, and theater_id are required" });
    }

    // Generate seat numbers based on theater_id
    const seatNumbers = generateSeatNumbers(theater_id);

    // Insert each seat into the database
    const insertPromises = seatNumbers.map((seat_number) =>
      new SEAT(seat_number, status, showtime_id, theater_id).create()
    );

    await Promise.all(insertPromises);

    return res.status(200).json({ msg: "Seats added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Helper function to generate seat numbers based on theater_id
function generateSeatNumbers(theater_id) {
  // Example: Generate seat numbers in a grid format
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

exports.getSeatsByShowtimeController = async (req, res) => {
  try {
    const { showtime_id } = req.params;
    const seats = await SEAT.getSeatsByShowtime(showtime_id);
    return res.status(200).json(seats[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getSeatsByMovieAndShowtimeController = async (req, res) => {
  try {
    const { movie_id, showtime_id } = req.params;
    const seats = await SEAT.getSeatsByMovieAndShowtime(movie_id, showtime_id);
    return res.status(200).json(seats[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getSeatsByDateAndTimeController = async (req, res) => {
  try {
    const { show_date, show_time } = req.params;
    const seats = await SEAT.getSeatsByDateAndTime(show_date, show_time);
    return res.status(200).json(seats[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateSeatStatusController = async (req, res) => {
  try {
    const { seatid } = req.params;
    const { status } = req.body;
    const updateRecord = await SEAT.updateSeatStatus(seatid, status);
    return res.status(200).json({
      updateRecord,
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
    const deleteRecord = await SEAT.deleteSeat(seatid);
    return res.status(200).json({
      deleteRecord,
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
    const seat = await SEAT.getSeatById(seatid);
    return res.status(200).json(seat[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllSeatsController = async (req, res) => {
  try {
    const seats = await SEAT.getAllSeats();
    return res.status(200).json(seats[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
