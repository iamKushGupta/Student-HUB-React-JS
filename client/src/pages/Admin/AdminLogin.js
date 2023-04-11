import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setError,
  setLoading,
  setUserInfo,
  setUserToken,
  setLoggedIn,
  setIsAdmin,
} from "../../features/user/userSlice";

import styles from "./AdminLogin.module.css";

const AdminLogin = () => {
  // Input useStates
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  // State
  const dispatch = useDispatch();

  // useNavigate
  const navigate = useNavigate();

  // onChange Handlers
  const adminUsernameChangeHandler = (event) => {
    setAdminUsername(event.target.value);
  };

  const adminPasswordChangeHandler = (event) => {
    setAdminPassword(event.target.value);
  };

  // submitHandlers
  const handleSubmitAdminLogin = async (event) => {
    dispatch(setLoading(true));
    event.preventDefault();

    if (adminUsername === "" || adminPassword === "") {
      dispatch(setError("Please fill all the fields"));
      dispatch(setLoading(false));
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            adminUsername: adminUsername,
            adminPassword: adminPassword,
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

      // Updating redux
      dispatch(
        setUserInfo({
          id: resData.data.userId,
          username: resData.data.username,
          email: resData.data.email,
          profilePic: resData.data.profilePic,
        })
      );
      dispatch(setUserToken(resData.data.token));
      dispatch(setLoggedIn(true));
      dispatch(setLoading(false));
      dispatch(setError());
      dispatch(setIsAdmin(true));

      // Updating localstorage
      const remainingMilliseconds = 10 * 60 * 60 * 1000;
      const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);
      localStorage.setItem("token", resData.data.token);
      localStorage.setItem("id", resData.data.userId);
      localStorage.setItem("email", resData.data.email);
      localStorage.setItem("username", resData.data.username);
      localStorage.setItem("profilePic", resData.data.profilePic);
      localStorage.setItem("expiryDate", expiryDate.toISOString());
      localStorage.setItem("isAdmin", true);

      navigate("/admin/posts");
    } catch (error) {
      dispatch(setError(error.message));
    }
    dispatch(setLoading(false));
  };

  return (
    <div className={styles["parent-container"]}>
      <div className={styles.secondaryContainer}>
        <form id="verify-form" onSubmit={handleSubmitAdminLogin}>
          <h1 className={styles.title}>Admin Login</h1>
          <div className={styles["input-field"]}>
            <i className="uil uil-user"></i>
            <input
              type="text"
              name="adminUsername"
              id="adminUsername"
              value={adminUsername}
              onChange={adminUsernameChangeHandler}
              placeholder="Admin username"
            />
          </div>
          <div className={styles["input-field"]}>
            <i className="uil uil-lock"></i>
            <input
              type="password"
              name="adminPassword"
              id="adminPassword"
              value={adminPassword}
              onChange={adminPasswordChangeHandler}
              placeholder="Admin Password"
            />
          </div>

          <input
            type="submit"
            value="Submit"
            className={`${styles["btn"]} ${styles["btn-primary"]}`}
          />
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
