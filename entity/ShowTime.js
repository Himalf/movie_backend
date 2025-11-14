const { EntitySchema } = require("typeorm");

const ShowTime = new EntitySchema({
  name: "ShowTime",
  tableName: "showtimes",
  columns: {
    showtimeid: {
      primary: true,
      type: "int",
      generated: true,
    },
    movie_id: {
      type: "int",
    },
    theater_id: {
      type: "int",
    },
    show_date: {
      type: "date",
    },
    show_time: {
      type: "time",
    },
  },
  relations: {
    movie: {
      type: "many-to-one",
      target: "Movie",
      joinColumn: {
        name: "movie_id",
      },
      inverseSide: "showtimes",
    },
    theater: {
      type: "many-to-one",
      target: "Theater",
      joinColumn: {
        name: "theater_id",
      },
      inverseSide: "showtimes",
    },
    seats: {
      type: "one-to-many",
      target: "Seat",
      inverseSide: "showtime",
    },
  },
});

module.exports = ShowTime;
