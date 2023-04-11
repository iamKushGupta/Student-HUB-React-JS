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
 *    Notification:
 *      type: object
 *      required:
 *        - notificationDate
 *        - notificationType
 *        - notificationAboutUser
 *      properties:
 *        notificationDate:
 *          type: string
 *        notificationType:
 *          type: string
 *        notificationAboutUser:
 *          type: string
 *
 * tags:
 *   name: Data
 *   description: Data management routes
 * 
 * /data/issue/create:
 *   put:
 *     summary: Create a new issue/post
 *     tags: [Data]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - category
 *               - description
 *             properties:
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Issue created
 *       404:
 *         description: Invalid user / Cannot verify user
 *       500:
 *         description: Some server error
 * 
 * /data/issue/all:
 *   get:
 *     summary: Get all the issues
 *     tags: [Data]
 *     responses:
 *       200:
 *         description: All the issues
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Post'
 *       404:
 *         description: Invalid user / Cannot verify user
 * 
 * /data/users/suggested:
 *   get:
 *     summary: Get all the suggested users
 *     tags: [Data]
 *     responses:
 *       200:
 *         description: All the suggested users
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       404:
 *         description: Users not found
 * 
 * /data/issue/trending:
 *   get:
 *     summary: Get all the trending issues
 *     tags: [Data]
 *     responses:
 *       200:
 *         description: All the trending issues
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Post'
 *       404:
 *         description: Issues not found
 * 
 * /data/issue/category/{category}:
 *   get:
 *     summary: Get all the issues of a particular category
 *     tags: [Data]
 *     parameters:
 *       - in: path
 *         name: category
 *         schema:
 *           type: string
 *         required: true
 *         description: Category of the issue
 *     responses:
 *       200:
 *         description: All the issues of a particular category
 *       404:
 *         description: Issues not found
 * 
 * /data/notification/:
 *   get:
 *     summary: Get all the notifications
 *     tags: [Data]
 *     responses:
 *       200:
 *         description: All the notifications
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Notification'
 *       404:
 *         description: Issues not found
 * 
 * /data/notification/delete:
 *   post:
 *     summary: Delete a notification
 *     tags: [Data]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - notificationId
 *             properties:
 *               notificationId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notification deleted
 *       404: 
 *         description: Notification not found
 *       500:
 *         description: Some server error
 *
 * /data/bookmarks/:
 *   get:
 *     summary: Get all the bookmarks
 *     tags: [Data]
 *     responses:
 *       200:
 *         description: All the bookmarks
 *       404:
 *         description: Bookmarks not found
 *
 * /data/bookmarks-id/:
 *   get:
 *     summary: Get bookmark by id
 *     tags: [Data]
 *     responses:
 *       200:
 *         description: Bookmark Found
 *       404:
 *         description: Bookmark not found
 *
 * /data/settings:
 *   post:
 *     summary: Update user settings
 *     tags: [Data]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - username
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notification deleted
 *       404: 
 *         description: Notification not found
 *       500:
 *         description: Some server error
 * 
 * /data/user-profile/{userId}:
 *   get:
 *     summary: Get user profile
 *     tags: [Data]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User Id
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 * 
 * /data/post/like:
 *   post:
 *     summary: Like a post
 *     tags: [Data]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - postId
 *             properties:
 *               postId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post liked
 *       404: 
 *         description: Post not found
 *       500:
 *         description: Some server error
 * 
 * /data/post/unlike:
 *   post:
 *     summary: Unlike a post
 *     tags: [Data]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - postId
 *             properties:
 *               postId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post unliked
 *       404: 
 *         description: Post not found
 *       500:
 *         description: Some server error
 * 
 * /data/post/bookmark:
 *   post:
 *     summary: Bookmark a post
 *     tags: [Data]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - postId
 *             properties:
 *               postId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post bookmarked
 *       404: 
 *         description: Post not found
 *       500:
 *         description: Some server error
 *
 * /data/post/unbookmark:
 *   post:
 *     summary: Unbookmark a post
 *     tags: [Data]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - postId
 *             properties:
 *               postId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post unbookmarked
 *       404: 
 *         description: Post not found
 *       500:
 *         description: Some server error
 * 
 * /data/user/follow:
 *   post:
 *     summary: Follow a user
 *     tags: [Data]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - followUserId
 *             properties:
 *               followUserId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User followed
 *       404: 
 *         description: User not found
 *       500:
 *         description: Some server error
 * 
 * /data/user/unfollow:
 *   post:
 *     summary: Unfollow a user
 *     tags: [Data]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - unfollowUserId
 *             properties:
 *               unfollowUserId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User unfollowed
 *       404: 
 *         description: User not found
 *       500:
 *         description: Some server error
 * 
 * /data/follow-status/{userId}:
 *   get:
 *     summary: Get follow status
 *     tags: [Data]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User Id
 *     responses:
 *       200:
 *         description: Follow status
 *       404:
 *         description: User not found
 * 
 * /data/search/{username}:
 *   get:
 *     summary: Search user
 *     tags: [Data]
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: Username
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 * 
*/


const path = require("path");

const express = require("express");
const { body } = require("express-validator");

const isAuth = require("../middleware/is-auth");
const homeController = require("../controllers/data");

const router = express.Router();

// PUT /data/issue/create

router.put(
  "/issue/create",
  [
    body("category").trim().notEmpty().withMessage("Please select a category"),
    body("description").trim().notEmpty(),
  ],
  isAuth,
  homeController.putCreateIssue
);

// GET /data/issue/all

router.get("/issue/all", isAuth, homeController.getIssues);

// GET /data/users/suggessted

router.get("/users/suggessted", isAuth, homeController.getSuggestedUsers);

// GET /data/issue/trending

router.get("/issue/trending", isAuth, homeController.getTrendingIssues);

// GET /data/issue/category/:category

router.get(
  "/issue/category/:category",
  isAuth,
  homeController.getCategoryIssues
);

// GET /data/notification

router.get("/notification", isAuth, homeController.getNotifications);

// POST /data/notification/delete

router.post(
  "/notification/delete",
  [body("notificationId").trim().notEmpty()],
  isAuth,
  homeController.postDeleteNotification
);

// GET /data/bookmarks

router.get("/bookmarks", isAuth, homeController.getBookmarks);

// GET /data/bookmarks-id

router.get("/bookmarks-id", isAuth, homeController.getBookmarksId);

// POST /data/settings

router.post(
  "/settings",
  [
    body("username").trim().notEmpty().withMessage("Please enter a username"),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email address"),
  ],
  isAuth,
  homeController.postSettings
);

// GET /data/user-profile/:userId

router.get("/user-profile/:userId", isAuth, homeController.getUserProfile);

// POST /data/post/like

router.post(
  "/post/like",
  [body("postId").trim().notEmpty()],
  isAuth,
  homeController.postLikePost
);

// POST /data/post/unlike

router.post(
  "/post/unlike",
  [body("postId").trim().notEmpty()],

  isAuth,
  homeController.postUnlikePost
);

// POST /data/post/bookmark

router.post(
  "/post/bookmark",
  [body("postId").trim().notEmpty()],
  isAuth,
  homeController.postBookmarkPost
);

// POST /data/post/unbookmark

router.post(
  "/post/unbookmark",
  [body("postId").trim().notEmpty()],
  isAuth,
  homeController.postUnbookmarkPost
);

// POST /data/user/follow

router.post(
  "/user/follow",
  [body("followUserId").trim().notEmpty()],
  isAuth,
  homeController.postFollowUser
);

// POST /data/user/unfollow

router.post(
  "/user/unfollow",
  [body("unfollowUserId").trim().notEmpty()],
  isAuth,
  homeController.postUnfollowUser
);

// GET /data/follow-status/:userId

router.get("/follow-status/:userId", isAuth, homeController.getFollowStatus);

// GET /data/search/:username

router.get("/search/:username", isAuth, homeController.searchByName);

module.exports = router;
