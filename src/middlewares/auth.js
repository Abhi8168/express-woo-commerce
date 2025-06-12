const jwt = require("jsonwebtoken");
const HttpStatus = require("../constants/statusCodes");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ msg: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    if (!user || user.deleted === true) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ msg: "User not authorized or has been deleted." });
    }

    if (user.email !== decoded.email) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ msg: "User email does not match token." });
    }

    req.user = user;
    return next();
  } catch (err) {
    console.log("JWT verification error:", err);
    return res
      .status(HttpStatus.FORBIDDEN)
      .json({ success: false, msg: "Invalid token." });
  }
};
