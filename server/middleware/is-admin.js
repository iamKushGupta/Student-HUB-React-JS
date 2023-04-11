const User = require("../models/User");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");

    if (!authHeader) {
      const error = new Error("Not authenticated");
      error.statusCode = 401;
      throw error;
    }

    const token = authHeader.split(" ")[1];

    if (!authHeader) {
      const error = new Error("Not authenticated");
      error.statusCode = 401;
      throw error;
    }

    let decodedToken;

    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      err.statusCode = 500;
      throw err;
    }

    if (!decodedToken) {
      const error = new Error("Not authenticated");
      error.statusCode = 401;
      throw error;
    }

    const user = await User.findById(decodedToken.userId);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    if (!user.isAdmin) {
      const error = new Error("You are not authorized to perform this action");
      error.statusCode = 403;
      throw error;
    }

    req.userId = decodedToken.userId;

    next();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
