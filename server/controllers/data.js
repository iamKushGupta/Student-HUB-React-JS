const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Post = require("../models/Post");
const Notification = require("../models/Notification");
const { validationResult } = require("express-validator");

exports.putCreateIssue = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    let userId = req.userId;
    let { category, description } = req.body;

    let image = req.file;

    const imageUrl = image
      ? process.env.BACKEND_URL + "/image/" + image.key
      : "";

    if (!userId) {
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      throw error;
    }

    const post = new Post({
      postDate: Date.now(),
      postCategory: category,
      postDescription: description,
      postImage: imageUrl,
      postedBy: userId,
    });

    const savedPost = await post.save();

    if (!savedPost) {
      const error = new Error("Error saving post");
      error.statusCode = 500;
      throw error;
    }

    await User.updateOne(
      { _id: userId },
      {
        $push: {
          posts: {
            _id: savedPost._id,
          },
        },
      }
    );

    return res.status(201).json({
      message: "Post created!",
      data: {},
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
    // BFS of the friends issues

    const userId = req.userId;

    const toFetchUser = [userId];
    const isVisited = {};
    const fetchedPosts = [];

    while (toFetchUser.length > 0 && fetchedPosts.length < 10) {
      const topUser = toFetchUser.shift();

      if (isVisited[topUser]) {
        continue;
      }

      isVisited[topUser] = true;

      const topUserPosts = await Post.find({ postedBy: topUser })
        .populate({
          path: "postedBy",
        })
        .populate({
          path: "postLikedBy",
        })
        .exec();

      fetchedPosts.push(...topUserPosts);

      const topUserFriends = await User.findById(topUser)
        .populate({
          path: "friends",
        })
        .exec();

      toFetchUser.push(...topUserFriends.friends.map((friend) => friend._id));
    }

    fetchedPosts.sort((a, b) => b.postDate - a.postDate);

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

exports.getSuggestedUsers = async (req, res, next) => {
  try {
    let userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("Authorization failed!");
      error.statusCode = 401;
      throw error;
    }

    const suggestedUsers = await User.find({
      $and: [
        {
          _id: {
            $not: {
              $in: user.friends,
            },
          },
        },
        {
          _id: {
            $not: {
              $eq: userId,
            },
          },
        },
      ],
    })
      .limit(3)
      .exec();

    if (!suggestedUsers) {
      const error = new Error("Error fetching suggested users");
      error.statusCode = 500;
      throw error;
    }

    return res.status(200).json({
      message: "Suggested users fetched!",
      data: suggestedUsers,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getTrendingIssues = async (req, res, next) => {
  try {
    const trendingIssues = await Post.find({})
      .sort({ postLikes: -1 })
      .limit(6)
      .populate({
        path: "postedBy",
      })
      .exec();

    if (!trendingIssues) {
      const error = new Error("Error fetching trending issues");
      error.statusCode = 500;
      throw error;
    }

    return res.status(200).json({
      message: "Trending issues fetched!",
      data: trendingIssues,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getCategoryIssues = async (req, res, next) => {
  try {
    let { category } = req.params;

    const categoryIssues = await Post.find({ postCategory: category })
      .populate({
        path: "postedBy",
      })
      .populate({
        path: "postLikedBy",
        options: {
          limit: 2,
        },
      });

    if (!categoryIssues) {
      const error = new Error("Error fetching category issues");
      error.statusCode = 500;
      throw error;
    }

    return res.status(200).json({
      message: "Category issues fetched!",
      data: categoryIssues,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getNotifications = async (req, res, next) => {
  try {
    let userId = req.userId;

    const user = await User.findOne({ _id: userId })
      .populate({
        path: "notifications",
        populate: { path: "notificationAboutUser" },
      })
      .sort({ "notifications.notificationDate": 1 })
      .exec();

    if (!user) {
      const error = new Error("Error fetching notifications");
      error.statusCode = 500;
      throw error;
    }

    return res.status(200).json({
      message: "Notifications fetched!",
      data: user.notifications,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postDeleteNotification = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    let { notificationId } = req.body;

    await Notification.deleteOne({ _id: notificationId });

    return res.status(200).json({
      message: "Notification deleted!",
      data: {},
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getBookmarks = async (req, res, next) => {
  try {
    let userId = req.userId;

    const user = await User.findOne({ _id: userId })
      .populate({
        path: "booksmarks",
        populate: { path: "postedBy" },
      })
      .populate({
        path: "booksmarks",
        populate: {
          path: "postLikedBy",
          options: {
            limit: 2,
          },
        },
      })
      .exec();

    if (!user) {
      const error = new Error("Error fetching bookmarks");
      error.statusCode = 500;
      throw error;
    }

    return res.status(200).json({
      message: "Bookmarks fetched!",
      data: user.booksmarks,
    });
  } catch (err) {}
};

exports.getBookmarksId = async (req, res, next) => {
  try {
    let userId = req.userId;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      const error = new Error("Error fetching bookmarks");
      error.statusCode = 500;
      throw error;
    }

    return res.status(200).json({
      message: "Bookmarks fetched!",
      data: user.booksmarks,
    });
  } catch (err) {}
};

exports.postSettings = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    const image = req.file;

    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    let userId = req.userId;
    let { username, email } = req.body;

    if (image) {
      const imageUrl = process.env.BACKEND_URL + "/image/" + image.key;
      const user = await User.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            username: username.trim(),
            email: email.trim(),
            profilePic: imageUrl,
          },
        }
      );

      return res.status(200).json({
        message: "Settings updated!",
        data: {
          userId: user._id.toString(),
          username: user.username,
          email: user.email,
          profilePic: user.profilePic,
        },
      });
    }

    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: { username: username.trim(), email: email.trim() },
      }
    );

    return res.status(200).json({
      message: "Settings updated!",
      data: {
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

exports.getUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ _id: userId })
      .populate({
        path: "posts",
        populate: {
          path: "postedBy",
        },
      })
      .populate({
        path: "posts",
        populate: {
          path: "postLikedBy",
          options: {
            limit: 2,
          },
        },
      })
      .exec();

    if (!user) {
      const error = new Error("Error fetching user profile");
      error.statusCode = 500;
      throw error;
    }

    return res.status(200).json({
      message: "User profile fetched!",
      data: user,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postLikePost = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { postId } = req.body;
    const userId = req.userId;

    const likedPost = await Post.findOneAndUpdate(
      { _id: postId },
      {
        $addToSet: {
          postLikedBy: {
            _id: [userId],
          },
        },
        $inc: {
          postLikes: 1,
        },
      }
    );

    if (!likedPost) {
      const error = new Error("Error liking post");
      error.statusCode = 500;
      throw error;
    }

    if (likedPost.postedBy._id.toString() !== userId) {
      const notification = new Notification({
        notificationDate: Date.now(),
        notificationType: "liked your post.",
        notificationAboutUser: userId,
      });

      const savedNotification = await notification.save();

      await User.updateOne(
        { _id: likedPost.postedBy },
        {
          $push: {
            notifications: {
              _id: savedNotification._id,
            },
          },
        }
      );
    }

    return res.status(200).json({
      message: "Post liked!",
      data: {},
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postUnlikePost = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { postId } = req.body;
    const userId = req.userId;

    const unlikedPost = await Post.findOneAndUpdate(
      { _id: postId },
      {
        $pull: {
          postLikedBy: {
            $in: [userId],
          },
        },
        $inc: {
          postLikes: -1,
        },
      }
    );

    if (!unlikedPost) {
      const error = new Error("Error unliking post");
      error.statusCode = 500;
      throw error;
    }

    if (unlikedPost.postedBy._id.toString() !== userId) {
      const notification = new Notification({
        notificationDate: Date.now(),
        notificationType: "unliked your post.",
        notificationAboutUser: userId,
      });

      const savedNotification = await notification.save();

      await User.updateOne(
        { _id: unlikedPost.postedBy },
        {
          $push: {
            notifications: {
              _id: savedNotification._id,
            },
          },
        }
      );
    }

    return res.status(200).json({
      message: "Post unliked!",
      data: {},
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postBookmarkPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { postId } = req.body;
    const userId = req.userId;

    const bookedMarkPostUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        $addToSet: {
          booksmarks: {
            _id: [postId],
          },
        },
      }
    );

    const notification = new Notification({
      notificationDate: Date.now(),
      notificationType: "bookmarked your post.",
      notificationAboutUser: userId,
    });

    let savedNotification = await notification.save();

    const bookedMarkPost = await Post.findById(postId);

    const updatedUser = await User.updateOne(
      { _id: bookedMarkPost.postedBy },
      {
        $push: {
          notifications: {
            _id: savedNotification._id,
          },
        },
      }
    );

    console.log(updatedUser);

    if (!updatedUser) {
      const error = new Error("Error bookmarking post");
      error.statusCode = 500;
      throw error;
    }

    return res.status(200).json({
      message: "Post bookmarked!",
      data: {},
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postUnbookmarkPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { postId } = req.body;
    const userId = req.userId;

    const unbookedMarkPostUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        $pull: {
          booksmarks: {
            $in: [postId],
          },
        },
      }
    );

    if (!unbookedMarkPostUser) {
      const error = new Error("Error unbookmarking post");
      error.statusCode = 500;
      throw error;
    }

    const notification = new Notification({
      notificationDate: Date.now(),
      notificationType: "unbookmarked your post.",
      notificationAboutUser: userId,
    });

    let savedNotification = await notification.save();

    const bookedMarkPost = await Post.findById(postId);

    const updatedUser = await User.updateOne(
      { _id: bookedMarkPost.postedBy },
      {
        $push: {
          notifications: {
            _id: savedNotification._id,
          },
        },
      }
    );

    if (!updatedUser) {
      const error = new Error("Error unbookmarking post");
      error.statusCode = 500;
      throw error;
    }

    return res.status(200).json({
      message: "Post unbookmarked!",
      data: {},
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postFollowUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const followUserId = req.body.followUserId;
    const currentUserId = req.userId;

    await User.updateOne(
      { _id: currentUserId },
      {
        $push: {
          friends: {
            _id: followUserId,
          },
        },
      }
    );

    const notification = new Notification({
      notificationDate: Date.now(),
      notificationType: "followed you.",
      notificationAboutUser: currentUserId,
    });

    await notification.save();

    await User.updateOne(
      { _id: followUserId },
      {
        $push: {
          notifications: {
            _id: notification._id,
          },
        },
      }
    );

    return res.status(200).json({
      message: "User followed!",
      data: {},
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postUnfollowUser = async (req, res, next) => {
  try {
    const userToUnfollow = req.body.unfollowUserId;
    const currentUserId = req.userId;

    await User.updateOne(
      { _id: currentUserId },
      {
        $pull: {
          friends: {
            $in: [userToUnfollow],
          },
        },
      }
    );

    const notification = new Notification({
      notificationDate: Date.now(),
      notificationType: "unfollowed you.",
      notificationAboutUser: currentUserId,
    });

    await notification.save();

    await User.updateOne(
      { _id: userToUnfollow },
      {
        $push: {
          notifications: {
            _id: notification._id,
          },
        },
      }
    );

    return res.status(200).json({
      message: "User unfollowed!",
      data: {},
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getFollowStatus = async (req, res, next) => {
  try {
    const followUserId = req.params.userId;
    const currentUserId = req.userId;

    const isFollowing = await User.findOne({
      _id: currentUserId,
      friends: { $in: [followUserId] },
    });

    return res.status(200).json({
      message: "Follow status fetched.",
      data: isFollowing,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.searchByName = async (req, res, next) => {
  try {
    const name = req.params.username;

    var userFilter = User.find({
      username: {
        $regex: name,
        $options: "i",
      },
    })
      .sort({ updated_at: -1 })
      .sort({ created_at: -1 })
      .limit(20);

    const users = await userFilter.exec();

    return res.status(200).json({
      message: "Users fetched.",
      data: users,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
