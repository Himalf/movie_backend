const { EntitySchema } = require("typeorm");

const Seat = new EntitySchema({
  name: "Seat",
  tableName: "seats",
  columns: {
    seatid: {
      primary: true,
      type: "int",
      generated: true,
    },
    seat_number: {
      type: "varchar",
      length: 10,
    },
    status: {
      type: "enum",
      enum: ["available", "Booked"],
      default: "available",
    },
    showtime_id: {
      type: "int",
    },
  },
  relations: {
    showtime: {
      type: "many-to-one",
      target: "ShowTime",
      joinColumn: {
        name: "showtime_id",
      },
      inverseSide: "seats",
    },
    bookings: {
      type: "one-to-many",
      target: "Booking",
      inverseSide: "seat",
    },
  },
});

module.exports = Seat;
