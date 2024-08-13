const BOOKING = require("../model/booking");

// Controller to create a booking
exports.createBookingController = async (req, res) => {
  try {
    const { user_id, showtime_id, seat_ids } = req.body;

    if (!seat_ids || seat_ids.length === 0) {
      return res.status(400).json({ error: "Seat IDs are required" });
    }

    const bookingModel = new BOOKING(user_id, showtime_id, seat_ids);
    await bookingModel.create();

    return res.status(200).json({
      msg: "Booking created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to get a booking by ID
exports.getBookingByIdController = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const [booking] = await BOOKING.getBookingById(booking_id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    return res.status(200).json(booking);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to get all bookings
exports.getAllBookingsController = async (req, res) => {
  try {
    const [bookings] = await BOOKING.getAllBookings();
    return res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to get bookings by user ID
exports.getBookingsByUserIdController = async (req, res) => {
  try {
    const { user_id } = req.params;
    const [bookings] = await BOOKING.getBookingsByUserId(user_id);
    return res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to delete a booking
exports.deleteBookingController = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const deleteRecord = await BOOKING.deleteBooking(booking_id);
    if (deleteRecord.affectedRows === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }
    return res.status(200).json({
      msg: "Booking deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
