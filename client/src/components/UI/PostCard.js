import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setError, setLoading } from "../../features/user/userSlice";
import { Link } from "react-router-dom";

import heart_img from "../../assets/heart.png";
import heart_liked_img from "../../assets/heart_liked.png";
import bookmark from "../../assets/bookmark.png";
import bookmark_bookmarked from "../../assets/bookmark_bookmarked.png";

import classes from "./PostCard.module.css";

const PostCard = ({ post, bookmarks }) => {
  const dispatch = useDispatch();
  const { userInfo, userToken } = useSelector((state) => state.user);

  let likedByCurrentUser;

  let bookmarkedByCurrentUser;

  if (userInfo) {
    likedByCurrentUser = post.postLikedBy.find((user) => {
      return user._id.toString() === userInfo.id.toString();
    });
  }

  bookmarkedByCurrentUser = bookmarks.find((bookmark) => {
    return bookmark.toString() === post._id.toString();
  });

  const [isLiked, setIsLiked] = useState(likedByCurrentUser !== undefined);
  const [isBookmarked, setIsBookmarked] = useState(
    bookmarkedByCurrentUser !== undefined
  );

  var periods = {
    month: 30 * 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
  };

  const formatTime = (diff) => {
    if (diff > periods.month) {
      return Math.floor(diff / periods.month) + " months ago";
    } else if (diff > periods.week) {
      return Math.floor(diff / periods.week) + " weeks ago";
    } else if (diff > periods.day) {
      return Math.floor(diff / periods.day) + " days ago";
    } else if (diff > periods.hour) {
      return Math.floor(diff / periods.hour) + " hours ago";
    } else if (diff > periods.minute) {
      return Math.floor(diff / periods.minute) + " minutes ago";
    }
    return "Just now";
  };

  const postTimestamp = formatTime(
    Date.now() - new Date(post.postDate).getTime()
  );

  const likePost = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/data/post/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId: post._id,
          }),
        }
      );

      const resData = await res.json();

      if (res.status === 422) {
        dispatch(
          setError(
            `${resData.message ? resData.message : ""} ${
              resData.data ? resData.data[0].msg : ""
            }` || "Validation failed. Please try again."
          )
        );
        dispatch(setLoading(false));
        return;
      }

      if (res.status !== 200 && res.status !== 201) {
        dispatch(
          setError(
            `${resData.message ? resData.message : ""} ${
              resData.data ? resData.data[0].msg : ""
            }` || "Something went wrong."
          )
        );
        dispatch(setLoading(false));
        return;
      }
    } catch (err) {
      dispatch(setError(err.message));
    }

    dispatch(setLoading(false));
  };

  const dislikePost = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/data/post/unlike`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId: post._id,
          }),
        }
      );

      const resData = await res.json();

      if (res.status === 422) {
        dispatch(
          setError(
            `${resData.message ? resData.message : ""} ${
              resData.data ? resData.data[0].msg : ""
            }` || "Validation failed. Please try again."
          )
        );
        dispatch(setLoading(false));
        return;
      }

      if (res.status !== 200 && res.status !== 201) {
        dispatch(
          setError(
            `${resData.message ? resData.message : ""} ${
              resData.data ? resData.data[0].msg : ""
            }` || "Something went wrong."
          )
        );
        dispatch(setLoading(false));
        return;
      }
    } catch (err) {
      dispatch(setError(err.message));
    }

    dispatch(setLoading(false));
  };

  const bookmarkPost = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/data/post/bookmark`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId: post._id,
          }),
        }
      );

      const resData = await res.json();

      if (res.status === 422) {
        dispatch(
          setError(
            `${resData.message ? resData.message : ""} ${
              resData.data ? resData.data[0].msg : ""
            }` || "Validation failed. Please try again."
          )
        );
        dispatch(setLoading(false));
        return;
      }

      if (res.status !== 200 && res.status !== 201) {
        dispatch(
          setError(
            `${resData.message ? resData.message : ""} ${
              resData.data ? resData.data[0].msg : ""
            }` || "Something went wrong."
          )
        );
        dispatch(setLoading(false));
        return;
      }
    } catch (err) {
      dispatch(setError(err.message));
    }

    dispatch(setLoading(false));
  };

  const unbookmarkPost = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/data/post/unbookmark`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId: post._id,
          }),
        }
      );

      const resData = await res.json();

      if (res.status === 422) {
        dispatch(
          setError(
            `${resData.message ? resData.message : ""} ${
              resData.data ? resData.data[0].msg : ""
            }` || "Validation failed. Please try again."
          )
        );
        dispatch(setLoading(false));
        return;
      }

      if (res.status !== 200 && res.status !== 201) {
        dispatch(
          setError(
            `${resData.message ? resData.message : ""} ${
              resData.data ? resData.data[0].msg : ""
            }` || "Something went wrong."
          )
        );
        dispatch(setLoading(false));
        return;
      }
    } catch (err) {
      dispatch(setError(err.message));
    }

    dispatch(setLoading(false));
  };

  const likeHandler = async () => {
    if (userInfo) {
      setIsLiked((prevState) => {
        if (prevState) {
          post.postLikedBy = post.postLikedBy.filter(
            (user) => user._id !== userInfo.id
          );
          dislikePost();
          return false;
        } else {
          post.postLikedBy.push({
            _id: userInfo.id,
            profilePic: userInfo ? userInfo.profilePic : "",
            username: userInfo ? userInfo.username : "",
          });
          likePost();
          return true;
        }
      });
    }
  };

  const bookmarkHandler = () => {
    setIsBookmarked((prevState) => {
      if (userInfo) {
        if (prevState) {
          unbookmarkPost();
          return false;
        } else {
          bookmarkPost();
          return true;
        }
      }
    });
  };

  return (
    <div className={classes["feed"]}>
      <div className={classes["head"]}>
        <div className={classes["user"]}>
          <div className={classes["profile-photo"]}>
            <img
              src={post.postedBy.profilePic}
              style={{
                objectFit: "cover",
                minWidth: "100%",
                minHeight: "100%",
              }}
              alt="profile"
            />
          </div>
          <div className={classes["info"]}>
            <Link
              as={Link}
              to={`/profile/${post.postedBy._id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <h3>{post.postedBy.username}</h3>
            </Link>
            <small id="time-stamp">{postTimestamp}</small>
          </div>
        </div>
        <span className={classes["edit"]}>
          <i className="uil uil-ellipsis-h"></i>
        </span>
      </div>
      {post.postImage && (
        <div className={classes["photo"]}>
          <img src={post.postImage} alt="https://localhost:3000" />
        </div>
      )}
      <div className={classes["action-buttons"]}>
        <div
          className={classes["interaction-buttons"]}
          style={{ width: "100px" }}
        >
          <span>
            <button
              onClick={likeHandler}
              style={{ border: "none", background: "none", cursor: "pointer" }}
              className={`${classes["like-button"]} ${
                !isLiked && classes["not-liked"]
              } ${isLiked && classes["liked"]}`}
            >
              <img
                className={classes["not-liked-img"]}
                src={heart_img}
                style={{
                  width: "15px",
                  margin: "0% 1%",
                  alignItems: "center",
                }}
                alt="heart"
              />
              <img
                className={classes["liked-img"]}
                src={heart_liked_img}
                style={{
                  width: "15px",
                  margin: "0% 1%",
                  alignItems: "center",
                }}
                alt="heart"
              ></img>
            </button>
          </span>
        </div>
        <div className={classes["bookmark"]}>
          <span>
            <button
              onClick={bookmarkHandler}
              style={{ border: "none", background: "none", cursor: "pointer" }}
              className={`${classes["bookmark-button"]} ${
                !isBookmarked && classes["not-bookmarked"]
              } ${isBookmarked && classes["bookmarked"]}`}
            >
              <img
                className={classes["not-bookmarked-img"]}
                src={bookmark}
                style={{ width: "15px" }}
                alt="bookmark"
              />
              <img
                className={classes["bookmarked-img"]}
                src={bookmark_bookmarked}
                style={{ width: "15px" }}
                alt="bookmark"
              />
            </button>
          </span>
        </div>
      </div>
      <div>
        {post.postLikedBy.length === 0 && (
          <p className={classes["liked-by"]} style={{ margin: "0% 1%" }}>
            Be the first one to like the post.
          </p>
        )}
        {post.postLikedBy.length === 1 && (
          <div className={classes["liked-by"]}>
            <div className={classes["profile-photo"]}>
              <img
                src={post.postLikedBy[0].profilePic}
                style={{
                  objectFit: "cover",
                  minWidth: "100%",
                  minHeight: "100%",
                }}
                alt="profile"
              />
            </div>
            <p className={classes["liked-by"]}>
              Liked by {post.postLikedBy[0].username}.
            </p>
          </div>
        )}

        {post.postLikedBy.length === 2 && (
          <div className={classes["liked-by"]}>
            <div className={classes["profile-photo"]}>
              <img
                src={post.postLikedBy[0].profilePic}
                style={{
                  objectFit: "cover",
                  minWidth: "100%",
                  minHeight: "100%",
                }}
                alt="profile"
              />
            </div>
            <div className={classes["profile-photo"]}>
              <img
                src={post.postLikedBy[1].profilePic}
                style={{
                  objectFit: "cover",
                  minWidth: "100%",
                  minHeight: "100%",
                }}
                alt="profile"
              />
            </div>
            <p className={classes["liked-by"]}>
              Liked by {post.postLikedBy[0].username} and{" "}
              {post.postLikedBy.length - 1} others.
            </p>
          </div>
        )}
      </div>

      <p style={{ margin: "0% 1%" }}>
        <b className={classes["username"]}>{post.postedBy.username}</b>
        &nbsp;
        {post.postDescription}
      </p>
    </div>
  );
};

export default PostCard;
