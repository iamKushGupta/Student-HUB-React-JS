import React, { useState, useEffect, useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";

import { setError, setLoading } from "../../features/user/userSlice";

import Sidebar from "../../components/HomePage/Sidebar";
import SuggestedUser from "../../components/HomePage/SuggestedUsers";
import Notification from "../../components/NotificationPage/Notification";

import classes from "./NotificationPage.module.css";

// const dummyNotifications = [
//   {
//     id: 1,
//     notificationAboutUser: {
//       id: 1,
//       username: "user1",
//       profilePic:
//         "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
//     },
//     notificationType: "liked your post",
//     notificationDate: "2021-05-01T00:00:00.000Z",
//   },
//   {
//     id: 2,
//     notificationAboutUser: {
//       id: 2,
//       username: "user2",
//       profilePic:
//         "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
//     },
//     notificationType: "commented on your post",
//     notificationDate: "2021-05-01T00:00:00.000Z",
//   },
// ];

const NotificationPage = ({ onShowCreateIssue }) => {
  const [notifications, setNotifications] = React.useState([]);
  const [fetchedSuggestedUsers, setFetchedSuggestedUsers] = useState([]);

  const dispatch = useDispatch();
  const { userInfo, userToken } = useSelector((state) => state.user);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/data/notification`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
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
      setNotifications(resData.data);
    } catch (err) {
      dispatch(setError(err.message));
    }
    dispatch(setLoading(false));
  }, [dispatch, userToken]);

  const fetchSuggestedUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/data/users/suggessted`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
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

      setFetchedSuggestedUsers(resData.data);
    } catch (err) {
      dispatch(setError(err.message));
    }

    dispatch(setLoading(false));
  }, [dispatch, userToken]);

  useEffect(() => {
    fetchSuggestedUsers();
    fetchNotifications();
  }, [fetchSuggestedUsers, fetchNotifications]);

  return (
    <div className={classes["parent-container"]}>
      <main>
        <div className={classes["container"]}>
          <div className={classes["left"]}>
            <Sidebar
              user={userInfo}
              onShowCreateIssue={onShowCreateIssue}
              isProfile={false}
            />
          </div>

          <div className={classes["middle"]}>
            <h3 className={classes["notification-page"]}>Notifications</h3>

            <div className={classes["notifications"]}>
              {notifications &&
                notifications.map((notification) => (
                  <Notification
                    key={notification._id}
                    notification={notification}
                  />
                ))}
            </div>
          </div>

          <div className={classes["right"]}>
            <SuggestedUser suggestedUsers={fetchedSuggestedUsers} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotificationPage;
