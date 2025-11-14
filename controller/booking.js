const AppDataSource = require("../config/data-source");

// Controller to create a booking
exports.createBookingController = async (req, res) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const { user_id, showtime_id, seat_ids } = req.body;

    if (!seat_ids || seat_ids.length === 0) {
      await queryRunner.rollbackTransaction();
      return res.status(400).json({ error: "Seat IDs are required" });
    }

    const bookingRepository = queryRunner.manager.getRepository("Booking");
    const seatRepository = queryRunner.manager.getRepository("Seat");

    // Create bookings for each seat
    for (const seat_id of seat_ids) {
      // Check if seat exists and is available
      const seat = await seatRepository.findOne({
        where: { seatid: parseInt(seat_id) },
      });

      if (!seat) {
        await queryRunner.rollbackTransaction();
        return res.status(404).json({ error: `Seat ${seat_id} not found` });
      }

      if (seat.status === "Booked") {
        await queryRunner.rollbackTransaction();
        return res
          .status(400)
          .json({ error: `Seat ${seat_id} is already booked` });
      }

      // Create booking
      const newBooking = bookingRepository.create({
        user_id: parseInt(user_id),
        showtime_id: parseInt(showtime_id),
        seat_id: parseInt(seat_id),
      });
      await bookingRepository.save(newBooking);

      // Update seat status
      seatRepository.merge(seat, { status: "Booked" });
      await seatRepository.save(seat);
    }

    await queryRunner.commitTransaction();
    return res.status(200).json({
      msg: "Booking created successfully",
    });
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await queryRunner.release();
  }
};

// Controller to get a booking by ID
exports.getBookingByIdController = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const bookingRepository = AppDataSource.getRepository("Booking");
    const booking = await bookingRepository.findOne({
      where: { bookingid: parseInt(booking_id) },
      relations: ["user", "showtime", "showtime.movie", "showtime.theater", "seat"],
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    
    // Transform data to include all related info directly
    const transformedBooking = {
      ...booking,
      user: booking.user || null,
      showtime: booking.showtime || null,
      seat: booking.seat || null,
      movie: booking.showtime?.movie || null,
      theater: booking.showtime?.theater || null,
      // Flattened fields for easy access
      user_name: booking.user?.fullname || null,
      user_email: booking.user?.email || null,
      movie_title: booking.showtime?.movie?.title || null,
      theater_name: booking.showtime?.theater?.theater_name || null,
      theater_location: booking.showtime?.theater?.theater_location || null,
      seat_number: booking.seat?.seat_number || null,
      show_date: booking.showtime?.show_date || null,
      show_time: booking.showtime?.show_time || null,
    };
    
    return res.status(200).json(transformedBooking);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to get all bookings
exports.getAllBookingsController = async (req, res) => {
  try {
    const bookingRepository = AppDataSource.getRepository("Booking");
    const bookings = await bookingRepository.find({
      relations: [
        "user",
        "showtime",
        "showtime.movie",
        "showtime.theater",
        "seat",
      ],
      order: {
        bookingid: "ASC",
      },
    });
    
    // Transform data to include all related info directly
    const transformedBookings = bookings.map(booking => ({
      ...booking,
      user: booking.user || null,
      showtime: booking.showtime || null,
      seat: booking.seat || null,
      movie: booking.showtime?.movie || null,
      theater: booking.showtime?.theater || null,
      // Flattened fields for easy access
      user_name: booking.user?.fullname || null,
      user_email: booking.user?.email || null,
      movie_title: booking.showtime?.movie?.title || null,
      theater_name: booking.showtime?.theater?.theater_name || null,
      theater_location: booking.showtime?.theater?.theater_location || null,
      seat_number: booking.seat?.seat_number || null,
      show_date: booking.showtime?.show_date || null,
      show_time: booking.showtime?.show_time || null,
    }));
    
    return res.status(200).json(transformedBookings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to get bookings by user ID
exports.getBookingsByUserIdController = async (req, res) => {
  try {
    const { user_id } = req.params;
    const bookingRepository = AppDataSource.getRepository("Booking");
    const bookings = await bookingRepository.find({
      where: { user_id: parseInt(user_id) },
      relations: [
        "user",
        "showtime",
        "showtime.movie",
        "showtime.theater",
        "seat",
      ],
      order: {
        bookingid: "ASC",
      },
    });

    // Transform to match expected format with all related data
    const transformedBookings = bookings.map((booking) => ({
      bookingid: booking.bookingid,
      show_time: booking.showtime?.show_time || null,
      show_date: booking.showtime?.show_date || null,
      seat_number: booking.seat?.seat_number || null,
      movie_title: booking.showtime?.movie?.title || null,
      // Include full objects for flexibility
      user: booking.user || null,
      showtime: booking.showtime || null,
      seat: booking.seat || null,
      movie: booking.showtime?.movie || null,
      theater: booking.showtime?.theater || null,
      // Additional flattened fields
      user_name: booking.user?.fullname || null,
      theater_name: booking.showtime?.theater?.theater_name || null,
      theater_location: booking.showtime?.theater?.theater_location || null,
    }));

    return res.status(200).json(transformedBookings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to delete a booking
exports.deleteBookingController = async (req, res) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const { booking_id } = req.params;
    const bookingRepository = queryRunner.manager.getRepository("Booking");
    const seatRepository = queryRunner.manager.getRepository("Seat");

    const booking = await bookingRepository.findOne({
      where: { bookingid: parseInt(booking_id) },
    });

    if (!booking) {
      await queryRunner.rollbackTransaction();
      return res.status(404).json({ error: "Booking not found" });
    }

    // Update seat status back to available
    const seat = await seatRepository.findOne({
      where: { seatid: booking.seat_id },
    });

    if (seat) {
      seatRepository.merge(seat, { status: "available" });
      await seatRepository.save(seat);
    }

    // Delete booking
    await bookingRepository.remove(booking);
    await queryRunner.commitTransaction();

    return res.status(200).json({
      msg: "Booking deleted successfully",
    });
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await queryRunner.release();
  }
};
