const { EntitySchema } = require("typeorm");

const MovieCategory = new EntitySchema({
  name: "MovieCategory",
  tableName: "movie_category",
  columns: {
    categoryid: {
      primary: true,
      type: "int",
      generated: true,
    },
    categoryname: {
      type: "varchar",
      length: 255,
    },
  },
  relations: {
    movies: {
      type: "one-to-many",
      target: "Movie",
      inverseSide: "moviecategory",
    },
  },
});

module.exports = MovieCategory;
