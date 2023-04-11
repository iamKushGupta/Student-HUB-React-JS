import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setError, setLoading } from "../../features/user/userSlice";

import Sidebar from "../../components/HomePage/Sidebar";
import SuggestedUser from "../../components/HomePage/SuggestedUsers";
import Feed from "../../components/HomePage/Feed";

import classes from "./BookmarkPage.module.css";
import { useEffect } from "react";

const BookmarkPage = ({ onShowCreateIssue }) => {
  // useStates
  const [bookmarks, setBookmarks] = useState([]);
  const [fetchedSuggestedUsers, setFetchedSuggestedUsers] = useState([]);

  // State
  const dispatch = useDispatch();
  const { userInfo, userToken } = useSelector((state) => state.user);

  const fetchBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/data/bookmarks`,
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

      setBookmarks(resData.data);
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
    fetchBookmarks();
    fetchSuggestedUsers();
  }, [fetchBookmarks, fetchSuggestedUsers]);

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
            <h3 className={classes["bookmark-page"]}>Bookmarks</h3>

            <Feed posts={bookmarks} />
          </div>

          <div className={classes["right"]}>
            <SuggestedUser suggestedUsers={fetchedSuggestedUsers} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookmarkPage;
