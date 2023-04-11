import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import {
  setError,
  setLoading,
  setUserInfo,
  setUserToken,
  setLoggedIn,
  setIsAdmin
} from "../../../features/user/userSlice";

import classes from "./LoginPage.module.css";
import loginSvg from "../../../assets/login_page_image.svg";
import loginSvg2 from "../../../assets/login_page_image_2.svg";

const LoginPage = () => {
  // useStates
  const [formMode, setFormMode] = useState("");

  // Input useStates
  const [signInUsername, setSignInUsername] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");

  // State
  const dispatch = useDispatch();

  // useNavigate
  const navigate = useNavigate();

  // Click Handlers
  const onClickSignUpModeHandler = () => {
    setFormMode("sign-up-mode");
  };

  const onClickSignInModeHandler = () => {
    setFormMode("");
  };

  // onChange Handlers
  const signInUsernameChangeHandler = (event) => {
    setSignInUsername(event.target.value);
  };

  const signInPasswordChangeHandler = (event) => {
    setSignInPassword(event.target.value);
  };

  const signUpEmailChangeHandler = (event) => {
    setSignUpEmail(event.target.value);
  };

  // submitHandlers

  const signInSubmitHandler = async (event) => {
    dispatch(setLoading(true));
    event.preventDefault();

    if (signInUsername === "" || signInPassword === "") {
      dispatch(setError("Please enter your email and password."));
      dispatch(setLoading(false));
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: signInUsername,
            password: signInPassword,
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
          email: resData.data.email,
          username: resData.data.username,
          profilePic: resData.data.profilePic,
        })
      );
      dispatch(setUserToken(resData.data.token));
      dispatch(setLoggedIn(true));
      dispatch(setLoading(false));
      dispatch(setError());
      dispatch(setIsAdmin(false));

      // Updating localstorage
      const remainingMilliseconds = 10 * 60 * 60 * 1000;
      const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);
      localStorage.setItem("token", resData.data.token);
      localStorage.setItem("id", resData.data.userId);
      localStorage.setItem("email", resData.data.email);
      localStorage.setItem("username", resData.data.username);
      localStorage.setItem("profilePic", resData.data.profilePic);
      localStorage.setItem("expiryDate", expiryDate.toISOString());
      localStorage.setItem("isAdmin", false);

      navigate("/home");
    } catch (err) {
      dispatch(setError(err.message));
    }

    dispatch(setLoading(false));
  };

  const signUpSubmitHandler = async (event) => {
    dispatch(setLoading(true));
    event.preventDefault();

    if (signUpEmail === "") {
      dispatch(setError("Please enter your email."));
      dispatch(setLoading(false));
      return;
    }

    if (!signUpEmail.includes("@")) {
      dispatch(setError("Please enter a valid email."));
      dispatch(setLoading(false));
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/auth/send-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: signUpEmail,
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

      dispatch(setLoading(false));
      dispatch(setError());
      navigate("/verify", {
        state: {
          email: signUpEmail,
        },
      });
    } catch (err) {
      dispatch(setError(err.message));
    }

    dispatch(setLoading(false));
  };

  return (
    <div>
      <div className={`${classes["container"]} ${classes[formMode]}`}>
        <div className={classes["forms-container"]}>
          <div className={classes["signin-signup"]}>
            <form
              className={classes["sign-in-form"]}
              onSubmit={signInSubmitHandler}
            >
              <h2 className={classes["title"]}>Sign In</h2>

              <div className={classes["input-field"]}>
                <i className="uil uil-user"></i>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Username"
                  value={signInUsername}
                  onChange={signInUsernameChangeHandler}
                />
              </div>
              <div className={classes["input-field"]}>
                <i className="uil uil-lock"></i>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  value={signInPassword}
                  onChange={signInPasswordChangeHandler}
                />
              </div>

              <input
                type="submit"
                value="Login"
                className={`${classes["btn"]} ${classes["btn-primary"]}`}
              />
            </form>

            <form
              className={classes["sign-up-form"]}
              onSubmit={signUpSubmitHandler}
            >
              <h2 className={classes["title"]}>Sign Up</h2>
              <div className={classes["input-field"]}>
                <i className="uil uil-at"></i>
                <input
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Email"
                  value={signUpEmail}
                  onChange={signUpEmailChangeHandler}
                />
              </div>

              <input
                type="submit"
                value="Sign up"
                className={`${classes["btn"]} ${classes["btn-primary"]}`}
              />
            </form>
          </div>
        </div>

        <div className={classes["panels-container"]}>
          <div className={`${classes["panel"]} ${classes["left-panel"]}`}>
            <div className={classes["content"]}>
              <h3>New here?</h3>
              <p>Sign up with us and be a part of the community !!!</p>
              <button
                className={`${classes["btn"]} ${classes["transparent"]}`}
                id="sign-up-btn"
                onClick={onClickSignUpModeHandler}
              >
                Sign up
              </button>
            </div>

            <img src={loginSvg} className={classes["image"]} alt="" />
          </div>

          <div className={`${classes["panel"]} ${classes["right-panel"]}`}>
            <div className={classes["content"]}>
              <h3>One of us?</h3>
              <p>
                Sign in using your existing username by clicking the button.
              </p>
              <button
                className={`${classes["btn"]} ${classes["transparent"]}`}
                id="sign-in-btn"
                onClick={onClickSignInModeHandler}
              >
                Sign in
              </button>
            </div>

            <img src={loginSvg2} className={classes["image"]} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
