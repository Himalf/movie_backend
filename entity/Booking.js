const { EntitySchema } = require("typeorm");

const Booking = new EntitySchema({
  name: "Booking",
  tableName: "bookings",
  columns: {
    bookingid: {
      primary: true,
      type: "int",
      generated: true,
    },
    user_id: {
      type: "int",
    },
    showtime_id: {
      type: "int",
    },
    seat_id: {
      type: "int",
    },
    created_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      nullable: true,
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "Register",
      joinColumn: {
        name: "user_id",
      },
    },
    showtime: {
      type: "many-to-one",
      target: "ShowTime",
      joinColumn: {
        name: "showtime_id",
      },
    },
    seat: {
      type: "many-to-one",
      target: "Seat",
      joinColumn: {
        name: "seat_id",
      },
      inverseSide: "bookings",
    },
  },
});

module.exports = Booking;
