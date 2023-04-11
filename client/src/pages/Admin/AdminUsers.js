import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setError, setLoading } from "../../features/user/userSlice";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import AdminUserComp from "../../components/Admin/AdminUserComp";

import styles from "./AdminUsers.module.css";

const AdminUsers = ({ logoutHandler }) => {
  const [fetchedUsers, setFetchedUsers] = useState([]);

  // State
  const dispatch = useDispatch();
  const { userToken } = useSelector((state) => state.user);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin/users`,
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

      console.log(resData.data);
      setFetchedUsers(resData.data);
    } catch (err) {
      dispatch(setError(err.message));
    }

    dispatch(setLoading(false));
  }, [dispatch, userToken]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className={styles["parent-container"]}>
      <main>
        <div className={styles["container"]}>
          <div className={styles["left"]}>
            <AdminSidebar logoutHandler={logoutHandler} />
          </div>

          <div
            className={styles["middle"]}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {fetchedUsers.map((user) => (
              <AdminUserComp user={user} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;
