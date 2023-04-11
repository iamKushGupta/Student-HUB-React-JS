/**
 * @swagger
 * components:
 *  schemas:
 *    AdminLogin:
 *      type: object
 *      required: 
 *        - adminUsername
 *        - adminPassword
 *      properties:
 *        adminUsername:
 *          type: string
 *        adminPassword:
 *          type: string
 *      example:
 *        adminUsername: admin
 *        adminPassword: admin
 * 
 *    Post:
 *      type: object
 *      required:
 *        - postDate
 *        - postCategory
 *        - postDescription
 *        - postImage
 *        - postedBy
 *        - postLikedBy
 *        - postComments
 *        - postLikes
 *      properties:
 *        postDate:
 *          type: date
 *        postCategory:
 *          type: string
 *        postDescription:
 *          type: string
 *        postImage:
 *          type: string
 *        postedBy:
 *          type: string
 *        postLikedBy:
 *          type: array
 *        postComments:
 *          type: array
 *        postLikes: 
 *          type: number
 *      example:
 *        postDate: 2021-05-01
 *        postCategory: "Technology"
 *        postDescription: "This is a post"
 *        postImage: "https://www.google.com"
 *        postedBy: "60a9b0b5b0b5b0b5b0b5b0b5"
 *        postLikedBy: ["60a9b0b5b0b5b0b5b0b5b0b5"]
 *        postComments: ["This is a comment"]
 *        postLikes: 0
 * 
 *    User:
 *      type: object
 *      required:
 *       - username
 *       - email
 *       - password
 *       - profilePic
 *       - friends
 *       - posts
 *       - bookmarks
 *       - notifications
 *       - isAdmin
 *      properties:
 *        username: 
 *          type: string
 *        email:
 *          type: string
 *        password:
 *          type: string
 *        profilePic:
 *          type: string
 *        friends:
 *          type: array
 *        posts:
 *          type: array
 *        bookmarks:
 *          type: array
 *        notifications:
 *          type: array
 *        isAdmin:
 *          type: boolean
 *      example:
 *        username: "John"
 *        email: "abc@gmail.com"
 *        password: "123456"
 *        profilePic: "https://www.google.com"
 *        friends: ["60a9b0b5b0b5b0b5b0b5b0b5"]
 *        posts: ["60a9b0b5b0b5b0b5b0b5b0b5"]
 *        bookmarks: ["60a9b0b5b0b5b0b5b0b5b0b5"]
 *        notifications: ["60a9b0b5b0b5b0b5b0b5b0b5"]
 *        isAdmin: false
 *          
 * tags:
 *   name: Admin
 *   description: Admin routes
 * /admin/login:
 *   post:
 *     summary: Admin Login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminLogin'
 *     responses:
 *       200:
 *         description: Admin logged in.
 *       404: 
 *         description: Admin not found
 *       500:
 *         description: Some server error
 *  
 * /admin/issue/all:
 *   get:
 *     summary: Get all the issues
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: All the issues
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Post'
  
 * /admin/users:
 *   get:
 *     summary: Get all the users
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: All the users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 * 
 * /admin/deletePost/{postId}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The post id
 * 
 *     responses:
 *       200:
 *         description: Post deleted
 *       404:
 *         description: Post not found
 * 
 * /admin/deleteUser/{postId}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 * 
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 * 
 * /admin/makeAdmin/{userId}:
 *   patch:
 *     summary: Make a user an admin
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *       - in: body
 *         name: admin
 *         schema:
 *         type: boolean
 *         required: true
 *         description: The admin status
 *     responses:
 *       200:
 *         description: User is now an admin
 *       404:
 *         description: User not found
 * 
*/

const path = require("path");
const { body } = require("express-validator");

const express = require("express");

const isAdmin = require("../middleware/is-admin");
const adminController = require("../controllers/admin");

const router = express.Router();

// POST admin/login

router.post(
  "/login",
  [
    body("adminUsername")
      .trim()
      .notEmpty()
      .withMessage("Please enter a username"),
    body("adminPassword")
      .trim()
      .notEmpty()
      .withMessage("Please enter a password"),
  ],
  adminController.postLogin
);

// GET admin/issue/all

router.get("/issue/all", isAdmin, adminController.getIssues);

// GET admin/users

router.get("/users", isAdmin, adminController.getUsers);

// DELETE admin/deletePost/:postId

router.delete("/deletePost/:postId", isAdmin, adminController.deletePost);

// DELETE admin/deleteUser/:userId

router.delete("/deleteUser/:userId", isAdmin, adminController.deleteUser);

// PATCH admin/makeAdmin/:userId

router.patch("/makeAdmin/:userId", isAdmin, adminController.makeAdmin);

module.exports = router;
