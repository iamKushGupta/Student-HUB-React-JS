import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setError, setLoading } from "../../features/user/userSlice";
import { Link } from "react-router-dom";

import delete_img from "../../assets/delete-button.png";

import classes from "./AdminPostCard.module.css";

const AdminPostCard = ({ post,deletePostHandler }) => {
  const dispatch = useDispatch();
  const { userInfo, userToken } = useSelector((state) => state.user);

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

  const deleteButtonHandler = async (event) => {
    event.preventDefault();

    // Create alert if yes and no for delete

    alert("Are you sure you want to delete this post?");

    console.log(post._id);

    await deletePostHandler({
      postId: post._id,
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
        <span className={classes["delete"]} onClick={deleteButtonHandler}>
          <img
            src={delete_img}
            style={{
              width: "15px",
              alignItems: "center",
            }}
          />
        </span>
      </div>
      {post.postImage && (
        <div className={classes["photo"]}>
          <img src={post.postImage} alt="https://localhost:3000" />
        </div>
      )}
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

export default AdminPostCard;
