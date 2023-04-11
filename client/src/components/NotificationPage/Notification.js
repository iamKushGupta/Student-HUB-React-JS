import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setError, setLoading } from "../../features/user/userSlice";

import deleteButton from "../../assets/delete-button.png";

import classes from "../../pages/Home/NotificationPage.module.css";

const Notification = ({ notification, fetchNotifications }) => {
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

  const notificationTimestamp = formatTime(
    Date.now() - new Date(notification.notificationDate).getTime()
  );

  const dispatch = useDispatch();
  const { userInfo, userToken } = useSelector((state) => state.user);
  const [showNotification, setShowNotification] = useState(true);

  const deleteNotification = async (notificationId) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/data/notification/delete`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notificationId: notificationId,
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

      setShowNotification(false);
      dispatch(setLoading(false));
    } catch (err) {
      dispatch(setError(err.message));
    }

    dispatch(setLoading(false));
  };

  return (
    showNotification && (
      <div
        className={classes["notification"]}
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div style={{ display: "flex" }}>
          <div className={classes["profile-photo"]}>
            <img
              src={notification.notificationAboutUser.profilePic}
              style={{
                objectFit: "cover",
                minWidth: "100%",
                minHeight: "100%",
              }}
              alt=""
            />
          </div>
          <div
            className={classes["notification-body"]}
            style={{ margin: "0px 10px" }}
          >
            <b>{notification.notificationAboutUser.username}</b>{" "}
            {notification.notificationType}
            <small
              className={classes["text-muted"]}
              style={{ display: "block" }}
            >
              {notificationTimestamp}
            </small>
          </div>
        </div>
        <div className={classes["action-buttons"]}>
          <img
            className={`${classes["delete-notification-button"]} ${classes["liked-img"]}`}
            src={deleteButton}
            style={{
              width: "15px",
              alignItems: "center",
              justifyContent: "center",
            }}
            alt=""
            onClick={() => {
              deleteNotification(notification._id);
            }}
          />
        </div>
      </div>
    )
  );
};

export default Notification;
