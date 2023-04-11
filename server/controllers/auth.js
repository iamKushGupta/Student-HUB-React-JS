const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");

const User = require("../models/User");
const UserOTPVerification = require("../models/UserOTPVerification");
const otpVerificationMailGenerator = require("../util/mails/otpVerification");

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com", // hostname
  secureConnection: false, // TLS requires secureConnection to be false
  port: 587, // port for secure SMTP
  tls: {
    ciphers: "SSLv3",
  },
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

exports.postSendOTP = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { email } = req.body;

    const otpuser = UserOTPVerification.find({ email: email });

    if (otpuser.length === 0) {
      await sendVerificationOTP(email);

      return res.status(200).json({
        message: "OTP Sent",
        data: {
          email: email,
        },
      });
    } else {
      await UserOTPVerification.deleteMany({
        email: email,
      });

      await sendVerificationOTP(email);

      return res.status(200).json({
        message: "OTP Sent",
        data: {
          email: email,
        },
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.verifyUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    let { otp, email } = req.body;

    const userOTPDocs = await UserOTPVerification.find({
      email: email,
    });

    if (userOTPDocs.length <= 0) {
      return res.json({
        message: "No otp requested for this email.",
        data: {},
      });
    }

    const { expiredAt, otp: hashedOtp } = userOTPDocs[0];

    if (expiredAt < Date.now()) {
      return res.json({
        message: "OTP has expired.",
        data: {},
      });
    }

    const isValid = await bcrypt.compare(otp, hashedOtp);

    if (!isValid) {
      return res.json({
        message: "Invalid OTP.",
        data: {},
      });
    }

    await UserOTPVerification.deleteMany({ email: email });

    return res.status(200).json({
      message: "Successfully verified.",
      data: {
        email: email,
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.putSignUp = async (req, res, next) => {
  try {
    console.log(req.file);
    const { email, username, password, confirmPassword } = req.body;

    const image = req.file;

    if (!image) {
      const error = new Error("No image provided.");
      error.statusCode = 422;
      throw error;
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const imageUrl = process.env.BACKEND_URL + "/image/" + image.key;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email: email,
      username: username,
      password: hashedPassword,
      profilePic: imageUrl,
    });

    await user.save();

    return res.status(201).json({
      message: "User created!",
      data: {},
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postLoginIn = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    let { username, password } = req.body;

    const user = await User.findOne({ username: username });

    if (!user) {
      const error = new Error("A user with this username could not be found.");
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      throw error;
    }

    console.log(user._id.toString());
    
    const token = jwt.sign(
      {
        username: user.username,
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      message: "User logged in!",
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

const sendVerificationOTP = async (email) => {
  try {
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    const mailOptions = otpVerificationMailGenerator(email, otp);

    const saltRounds = 10;

    bcrypt.hash(otp, saltRounds, (err, hash) => {
      if (err) {
        throw new Error(err.message);
      } else {
        const newotpverification = new UserOTPVerification({
          email: email,
          otp: hash,
          createdAt: Date.now(),
          expiredAt: Date.now() + 3600000,
        });

        newotpverification.save((err, docs) => {
          if (err) {
            console.log(err);
          } else {
            transporter.sendMail(mailOptions, () => {
              console.log("Email sent!");
              return;
            });
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
