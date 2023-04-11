/**
 * @swagger
 * components:
 *  schemas:
 *    UserLogin:
 *      type: object
 *      required: 
 *        - username
 *        - password
 *      properties:
 *        username:
 *          type: string
 *        password:
 *          type: string
 *      example:
 *        username: admin
 *        password: admin
 *          
 * tags:
 *   name: Auth
 *   description: Authentication routes
 * 
 * /auth/send-otp:
 *   post:
 *     summary: Send OTP to the user's email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent to the user's email.
 *       404: 
 *         description: Invalid email
 *       500:
 *         description: Some server error
 * 
 * /auth/verify-user:
 *   post:
 *     summary: verify otp sent to the user's email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified
 *       404: 
 *         description: Invalid email or OTP
 *       500:
 *         description: Some server error
 * 
 * /auth/signup:
 *   put:
 *     summary: Create a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - email
 *               - username
 *               - password
 *               - confirmPassword
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string 
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created
 *       404:
 *         description: Invalid email or password
 *       500:
 *         description: Some server error
 * 
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: User logged in
 *       404: 
 *         description: Invalid email or password
 *       500:
 *         description: Some server error
 * 
*/

const express = require("express");
const { body } = require("express-validator");

const User = require("../models/User");

const authController = require("../controllers/auth");

const router = express.Router();

// POST auth/send-otp

router.post(
  "/send-otp",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom(async (value, { req }) => {
        try {
          const user = await User.findOne({ email: value });

          if (user) {
            return Promise.reject("Email already exists");
          }

          return Promise.resolve();
        } catch (err) {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        }
      }),
  ],
  authController.postSendOTP
);

// POST auth/verify-otp

router.post(
  "/verify-user",
  [
    body("otp")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Please enter a valid email"),
    body("email").isEmail().withMessage("Please enter a valid email"),
  ],
  authController.verifyUser
);

// PUT auth/signup

router.put(
  "/sign-up",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom(async (value, { req }) => {
        try {
          const user = await User.findOne({ email: value });

          if (user) {
            return Promise.reject("Email already exists");
          }

          return Promise.resolve();
        } catch (err) {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        }
      }),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Please enter a non-empty username"),
    body("password")
      .trim()
      .isStrongPassword()
      .withMessage(
        "Please enter a password with at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 symbol"
      ),
  ],
  authController.putSignUp
);

// POST auth/login

router.post(
  "/login",
  [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Please enter a non-empty username"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Please enter a non-empty password"),
  ],
  authController.postLoginIn
);

module.exports = router;
