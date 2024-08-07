const REGISTER = require("../model/register");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const secretKey = "1522"; // Replace with your actual secret key

function generateAccessToken(email) {
  const token = jwt.sign({ email }, secretKey, { expiresIn: "1h" });
  return token;
}

exports.registerValidations = [
  body("email").not().isEmpty().trim().withMessage("Email is required"),
  body("password")
    .isLength({ min: 4 })
    .withMessage("Password must be at least 4 characters long"),
];

exports.register = async (req, res) => {
  const { fullname, email, password, confirmpassword, dateofbirth } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (password !== confirmpassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let userRegister = new REGISTER(
      null,
      fullname,
      email,
      hashedPassword,
      dateofbirth
    );
    let reg = await userRegister.create();

    res.status(201).json({
      err: false,
      msg: "User created successfully",
      user: reg,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const [user] = await REGISTER.findByEmail(email);
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const matched = await bcrypt.compare(password, user[0].password);
    if (!matched) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = generateAccessToken(user[0].email);
    res.status(200).json({
      msg: "Logged in successfully",
      token,
      user: user[0],
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const [users] = await REGISTER.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  const userid = req.params.userid;
  try {
    const [user] = await REGISTER.findById(userid);
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const userid = req.params.userid;
  const { fullname, email, password, dateofbirth } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let userUpdate = new REGISTER(
      userid,
      fullname,
      email,
      hashedPassword,
      dateofbirth
    );
    await userUpdate.update(userid);

    res.status(200).json({
      err: false,
      msg: "User updated successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const userid = req.params.userid;
  try {
    const [user] = await REGISTER.findById(userid);
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    await REGISTER.deleteUser(userid);
    res.status(200).json({
      err: false,
      msg: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Access denied, no token provided" });
  }

  try {
    const verified = jwt.verify(token, secretKey);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};
