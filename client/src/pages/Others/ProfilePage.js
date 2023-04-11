import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import Sidebar from "../../components/HomePage/Sidebar";
import SuggestedUser from "../../components/HomePage/SuggestedUsers";
import Feed from "../../components/HomePage/Feed";

import classes from "./ProfilePage.module.css";
import { setError, setLoading } from "../../features/user/userSlice";

const ProfilePage = ({ user, suggestedUsers, onShowCreateIssue }) => {
  const [fetchedPosts, setFetchedPosts] = useState([]);
  const [fetchedSuggestedUsers, setFetchedSuggestedUsers] = useState([]);
  const [bookmarks] = useState([]);

  const [profileUserInfo, setProfileUserInfo] = useState({});

  // State
  const dispatch = useDispatch();
  const { userToken } = useSelector((state) => state.user);

  // Params
  const { userId } = useParams();

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/data/user-profile/${userId}`,
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

      setFetchedPosts(resData.data.posts);
      setProfileUserInfo(resData.data);
    } catch (err) {
      dispatch(setError(err.message));
    }

    dispatch(setLoading(false));
  }, [dispatch, userToken, userId]);

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
    fetchPosts();
    fetchSuggestedUsers();
  }, [fetchPosts, fetchSuggestedUsers]);

  return (
    <div className={classes["parent-container"]}>
      <main>
        <div className={classes["container"]}>
          <div className={classes["left"]}>
            <Sidebar
              user={profileUserInfo}
              onShowCreateIssue={onShowCreateIssue}
              isProfile={true}
            />
          </div>

          <div className={classes["middle"]}>
            <Feed posts={fetchedPosts} bookmarks={bookmarks} />
          </div>

          <div className={classes["right"]}>
            <SuggestedUser suggestedUsers={fetchedSuggestedUsers} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
