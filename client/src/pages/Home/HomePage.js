import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import Sidebar from "../../components/HomePage/Sidebar";
import SuggestedUser from "../../components/HomePage/SuggestedUsers";
import Feed from "../../components/HomePage/Feed";

import classes from "./HomePage.module.css";
import TrendingIssues from "../../components/HomePage/TrendingIssues";
import { setError, setLoading } from "../../features/user/userSlice";

const HomePage = ({ onShowCreateIssue }) => {
  const [fetchedPosts, setFetchedPosts] = useState([]);
  const [fetchedSuggestedUsers, setFetchedSuggestedUsers] = useState([]);
  const [fetchedTrendingIssues, setFetchedTrendingIssues] = useState([]);
  const [bookmarks] = useState([]);

  // State
  const dispatch = useDispatch();
  const { userInfo, userToken } = useSelector((state) => state.user);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/data/issue/all`,
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

      setFetchedPosts(resData.data);
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

  const fetchTrendingIssues = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/data/issue/trending`,
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

      setFetchedTrendingIssues(resData.data);
    } catch (err) {
      dispatch(setError(err.message));
    }

    dispatch(setLoading(false));
  }, [dispatch, userToken]);

  useEffect(() => {
    fetchPosts();
    fetchSuggestedUsers();
    fetchTrendingIssues();
  }, [fetchPosts, fetchSuggestedUsers, fetchTrendingIssues]);

  const createIssueHandler = () => {
    onShowCreateIssue();
  };

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
            {fetchedTrendingIssues.length !== 0 && (
              <>
                <h3 className={classes["trending-issues"]}>Trending issues</h3>
                <TrendingIssues trendingIssues={fetchedTrendingIssues} />
              </>
            )}

            <form
              className={classes["create-post"]}
              onClick={createIssueHandler}
            >
              <div className={classes["profile-photo"]}>
                <img src={userInfo ? userInfo.profilePic : ""} alt="profile" />
              </div>
              <input
                type="text"
                placeholder="Is there anything bugging you?"
                id="create-post"
              />
              <input
                type="submit"
                value="Post"
                className={`${classes["btn"]} ${classes["btn-primary"]}`}
              />
            </form>

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

export default HomePage;
