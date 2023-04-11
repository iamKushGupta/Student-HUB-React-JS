import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import classes from "./NewPasswordPage.module.css";

const NewPasswordPage = (props) => {
  // useStates
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [newPasswordWarning, setNewPasswordWarning] = useState("");
  const [newPasswordInfo, setNewPasswordInfo] = useState("");
  const [inputType, setInputType] = useState("password");

  // useNavigate
  const navigate = useNavigate();

  // useLocation
  const location = useLocation();

  // useEffects
  useEffect(() => {
    if (location.state) {
      setEmail(location.state?.email);
    } else {
      navigate("/");
    }
  }, [location]);

  // onSubmitHandlers
  const newPasswordOnSubmitHandler = (event) => {
    event.preventDefault();

    if (newPassword === "") {
      setNewPasswordWarning("Please enter a new password.");
      setNewPasswordInfo("");
      return;
    }

    if (newPassword.length < 8) {
      setNewPasswordWarning("Password must be at least 8 characters long.");
      setNewPasswordInfo("");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setNewPasswordWarning("Passwords do not match.");
      setNewPasswordInfo("");
      return;
    }

    navigate("/");
  };

  return (
    <div className={classes["parent-container"]}>
      <div className={classes["container"]}>
        <form id="verify-form" onSubmit={newPasswordOnSubmitHandler}>
          <h2 className={classes["title"]} style={{ marginBottom: "10px" }}>
            Enter new Password
          </h2>
          <div className={classes["input-field"]}>
            <i className="uil uil-lock"></i>
            <input
              type={inputType}
              name="password"
              id="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </div>

          <input type="hidden" name="email" id="email" value="<%=email%>" />

          <div className={classes["input-field"]}>
            <i className="uil uil-lock"></i>
            <input
              type={inputType}
              name="confirm_password"
              id="confirm_password"
              placeholder="Confirm New Password"
              value={confirmNewPassword}
              onChange={(event) => setConfirmNewPassword(event.target.value)}
            />
          </div>
          <div style={{ marginTop: "2px" }}>
            <input
              id="checkbox"
              type="checkbox"
              style={{ fontSize: "12px" }}
              onClick={() => {
                document.getElementById("checkbox").checked
                  ? setInputType("text")
                  : setInputType("password");
              }}
            />
            <p
              style={{ display: "inline-block", margin: "2px", opacity: "0.5" }}
            >
              Show password
            </p>
          </div>

          <div className={classes["info"]}>
            <p>{newPasswordInfo}</p>
          </div>
          <div className={classes["warning"]}>
            <p>{newPasswordWarning}</p>
          </div>

          <input
            type="submit"
            value="Confirm"
            className={` ${classes["btn"]} ${classes["btn-primary"]}`}
          />
        </form>
      </div>
    </div>
  );
};

export default NewPasswordPage;
