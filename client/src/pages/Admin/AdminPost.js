import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import styles from "./AdminPost.module.css";
import { setError, setLoading } from "../../features/user/userSlice";

import AdminNavbar from "../../components/Admin/AdminNavbar";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import AdminFeed from "../../components/Admin/AdminFeed";

const AdminPost = ({ logoutHandler }) => {
  const [fetchedPosts, setFetchedPosts] = useState([]);

  // State
  const dispatch = useDispatch();
  const { userInfo, userToken } = useSelector((state) => state.user);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin/issue/all`,
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

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <main>
      <div className={styles["container"]}>
        <div className={styles["left"]}>
          <AdminSidebar logoutHandler={logoutHandler} />
        </div>

        <div className={styles["middle"]}>
          <AdminFeed posts={fetchedPosts} setPosts={setFetchedPosts} />
        </div>

        <div className={styles["right"]}></div>
      </div>
    </main>
  );
};

export default AdminPost;
