const { EntitySchema } = require("typeorm");

const Movie = new EntitySchema({
  name: "Movie",
  tableName: "movies",
  columns: {
    movieid: {
      primary: true,
      type: "int",
      generated: true,
    },
    title: {
      type: "varchar",
      length: 255,
    },
    description: {
      type: "text",
      nullable: true,
    },
    releasedate: {
      type: "date",
    },
    duration: {
      type: "int",
    },
    moviecategoryid: {
      type: "int",
    },
    poster: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
  },
  relations: {
    moviecategory: {
      type: "many-to-one",
      target: "MovieCategory",
      joinColumn: {
        name: "moviecategoryid",
      },
      inverseSide: "movies",
    },
    showtimes: {
      type: "one-to-many",
      target: "ShowTime",
      inverseSide: "movie",
    },
  },
});

module.exports = Movie;
