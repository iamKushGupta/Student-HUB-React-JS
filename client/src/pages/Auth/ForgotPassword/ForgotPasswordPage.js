import React, { useState} from "react";
import { useNavigate } from "react-router-dom";

import classes from "./ForgotPasswordPage.module.css";

const ForgotPasswordPage = (props) => {
  // useState
  const [email, setEmail] = useState("");
  const [forgotPasswordEmailInfo, setForgotPasswordEmailInfo] = useState("");
  const [forgotPasswordEmailWarning, setForgotPasswordEmailWarning] =
    useState("");

  // useNavigate
  const navigate = useNavigate();

  const forgotPasswordEmailHandler = (event) => {
    setEmail(event.target.value);
  };

  const forgotPasswordEmailSubmitHandler = (event) => {
    event.preventDefault();

    if (email === "") {
      setForgotPasswordEmailWarning("Please enter your email address.");
      setForgotPasswordEmailInfo("");
      return;
    }

    if (!email.includes("@")) {
      setForgotPasswordEmailWarning("Please enter a valid email address.");
      setForgotPasswordEmailInfo("");
      return;
    }

    navigate("/get-email", {
      state: {
        email: email,
      },
    });
  };

  return (
    <div className={classes["parent-container"]}>
      <div className={classes.container}>
        <form id="verify-form" onSubmit={forgotPasswordEmailSubmitHandler}>
          <h2 style={{ margin: "5%" }} className={classes.title}>
            Enter Your Email
          </h2>
          <div className={classes["input-field"]}>
            <i className="uil uil-at"></i>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              placeholder="Email"
              onChange={forgotPasswordEmailHandler}
            />
          </div>

          <input
            type="submit"
            value="submit"
            className={`${classes["btn"]} ${classes["btn-primary"]}`}
          />
          <div className={classes.info}>
            <p>{forgotPasswordEmailInfo}</p>
          </div>
          <div className={classes.warning}>
            <p>{forgotPasswordEmailWarning}</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
