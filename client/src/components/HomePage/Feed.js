import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setError, setLoading } from "../../features/user/userSlice";

import PostCard from "../UI/PostCard";

import classes from "./Feed.module.css";

const Feed = (props) => {
  const [bookmarks, setBookmarks] = useState([]);

  const dispatch = useDispatch()
  const { userInfo, userToken } = useSelector((state) => state.user);


  const fetchBookmarksById = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/data/bookmarks-id`,
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

  useEffect(() => {
    fetchBookmarksById();
  }, [fetchBookmarksById]);

  return (
    <div className={classes["feeds"]}>
      {props.posts &&
        props.posts.map((post) => (
          <PostCard key={post._id} post={post} bookmarks={bookmarks} />
        ))}
    </div>
  );
};

export default Feed;
