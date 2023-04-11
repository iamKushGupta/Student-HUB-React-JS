const User = require("../models/User");
const Post = require("../models/Post");
const Notification = require("../models/Notification");
const UserOTPVerification = require("../models/UserOTPVerification");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

exports.postLogin = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    let { adminUsername, adminPassword } = req.body;

    const user = await User.findOne({ username: adminUsername });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const isEqual = await bcrypt.compare(adminPassword, user.password);

    if (!isEqual) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      throw error;
    }

    if (!user.isAdmin) {
      const error = new Error("Please enter valid admin credentials");
      error.statusCode = 403;
      throw error;
    }

    const token = jwt.sign(
      {
        username: user.username,
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

    console.log(user._id.toString());

    return res.status(200).json({
      message: "Admin logged in!",
      data: {
        token: token,
        userId: user._id.toString(),
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getIssues = async (req, res, next) => {
  try {
    const fetchedPosts = await Post.find()
      .sort({ postDate: -1 })
      .populate({
        path: "postedBy",
      })
      .populate({
        path: "postLikedBy",
      })
      .exec();

    if (!fetchedPosts) {
      const error = new Error("Error fetching posts");
      error.statusCode = 500;
      throw error;
    }

    return res.status(200).json({
      message: "Posts fetched!",
      data: fetchedPosts,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isAdmin: false }).exec();

    if (!users) {
      const error = new Error("Error fetching users");
      error.statusCode = 500;
      throw error;
    }

    return res.status(200).json({
      message: "Users fetched!",
      data: users,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    await Post.deleteOne({ _id: postId });

    return res.status(200).json({
      message: "Post deleted!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    await User.deleteOne({ _id: userId });

    await User.updateMany(
      {
        friends: {
          $in: [userId],
        },
      },
      {
        $pullAll: {
          friends: {
            $in: [userId],
          },
        },
      }
    );

    await Notification.deleteMany({ notificationAboutUser: userId });

    await Post.deleteMany({ postedBy: userId });

    await Post.updateOne(
      {
        postedLikedBy: {
          $in: [userId],
        },
      },
      {
        $pullAll: {
          postedLikedBy: {
            $in: [userId],
          },
        },
      }
    );

    return res.status(200).json({
      message: "User deleted!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.makeAdmin = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    await User.updateOne({ _id: userId }, { isAdmin: true });

    return res.status(200).json({
      message: "User is now admin!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
