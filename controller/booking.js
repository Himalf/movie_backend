const BOOKING = require("../model/booking");

exports.createBookingController = async (req, res) => {
  try {
    const { user_id, showtime_id, seat_id } = req.body;

    if (!seat_id) {
      return res.status(400).json({ error: "Seat ID is required" });
    }

    const bookingModel = new BOOKING(user_id, showtime_id, seat_id);
    const createRecord = await bookingModel.create();
    return res.status(200).json({
      createRecord,
      msg: "Booking created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getBookingByIdController = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const booking = await BOOKING.getBookingById(booking_id);
    return res.status(200).json(booking[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllBookingsController = async (req, res) => {
  try {
    const bookings = await BOOKING.getAllBookings();
    return res.status(200).json(bookings[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getBookingsByUserIdController = async (req, res) => {
  try {
    const { user_id } = req.params;
    const bookings = await BOOKING.getBookingsByUserId(user_id);
    return res.status(200).json(bookings[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteBookingController = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const deleteRecord = await BOOKING.deleteBooking(booking_id);
    return res.status(200).json({
      deleteRecord,
      msg: "Booking deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
