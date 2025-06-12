const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HttpStatus = require("../constants/statusCodes");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "User with same email already exists",
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name,
      email: email,
      password: hashed,
    }); // Exclude password from response

    delete user.password; // Ensure password is not sent in response
    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred during registration",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password"); // Exclude password from the query result

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ success: false, message: "Invalid credentials" });
    }

    delete user.password; // Ensure password is not sent in response
    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred during login",
    });
  }
};
