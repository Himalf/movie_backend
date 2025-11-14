const { EntitySchema } = require("typeorm");

const Register = new EntitySchema({
  name: "Register",
  tableName: "register_user",
  columns: {
    userid: {
      primary: true,
      type: "int",
      generated: true,
    },
    fullname: {
      type: "varchar",
      length: 255,
    },
    phoneno: {
      type: "varchar",
      length: 20,
    },
    email: {
      type: "varchar",
      length: 255,
      unique: true,
    },
    password: {
      type: "varchar",
      length: 255,
    },
    dateofbirth: {
      type: "date",
      nullable: true,
    },
  },
});

module.exports = Register;
