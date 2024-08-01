const REGISTER = require("../model/register");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  const { fullname, email, password, confirmpassword, dateofbirth } = req.body;

  // Validate required fields
  if (!fullname || !email || !password || !confirmpassword || !dateofbirth) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (password !== confirmpassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let userRegister = new REGISTER(
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
