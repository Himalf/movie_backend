// routes/register.js
const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  verifyToken,
} = require("../controller/register");

router.post("/register", register);
router.post("/login", login);
router.get("/", getUsers);
router.get("/:userid", getUserById);
router.put("/:userid", updateUser);
router.delete("/:userid", deleteUser);

module.exports = router;
