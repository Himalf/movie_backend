const { EntitySchema } = require("typeorm");

const Theater = new EntitySchema({
  name: "Theater",
  tableName: "theaters",
  columns: {
    theaterid: {
      primary: true,
      type: "int",
      generated: true,
    },
    theater_name: {
      type: "varchar",
      length: 255,
    },
    theater_location: {
      type: "varchar",
      length: 255,
    },
  },
  relations: {
    showtimes: {
      type: "one-to-many",
      target: "ShowTime",
      inverseSide: "theater",
    },
  },
});

module.exports = Theater;
