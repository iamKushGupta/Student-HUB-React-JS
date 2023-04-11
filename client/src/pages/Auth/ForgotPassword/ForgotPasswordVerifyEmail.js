import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import classes from "./ForgotPasswordVerifyEmail.module.css";

const ForgotPasswordVerifyEmail = (props) => {
  // useNavigate
  const navigate = useNavigate();

  // input useStates
  const [email, setEmail] = useState("");
  const [verifyEmailWarning, setVerifyEmailWarning] = useState("");
  const [verifyEmailInfo, setVerifyEmailInfo] = useState("");
  const [enteredOTP, setEnteredOTP] = useState("");

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

  // onChangeHandlers
  const enteredOTPOnChangeHandler = (event) => {
    setEnteredOTP(event.target.value);
  };

  // onSubmitHandlers
  const verifyEmailOnSubmitHandler = (event) => {
    event.preventDefault();

    if (enteredOTP === "") {
      setVerifyEmailWarning("Please enter the OTP sent to your email.");
      setVerifyEmailInfo("");
      return;
    }

    if (enteredOTP !== "123456") {
      setVerifyEmailWarning("Wrong otp.");
      setVerifyEmailInfo("");
      return;
    }

    navigate("/new-password", {
      state: {
        email: email,
      },
    });
  };

  const resendOTPOnSubmitHandler = (event) => {
    event.preventDefault();

    setVerifyEmailWarning("");
    setVerifyEmailInfo("OTP resent to your email.");
  };

  return (
    <div className={classes["parent-container"]}>
      <div className={classes["container"]}>
        <form id="verify-form" onSubmit={verifyEmailOnSubmitHandler}>
          <h2 className={classes["title"]}>Verify Email</h2>
          <p style={{ marginTop: "4%", marginBottom: "2%" }}>
            We have sent an OTP to {email === "" ? "your email" : email}.
          </p>
          <div className={classes["input-field"]}>
            <i className="uil uil-envelope-lock"></i>
            <input
              type="text"
              name="otp"
              id="otp"
              placeholder="Enter the OTP"
              value={enteredOTP}
              onChange={enteredOTPOnChangeHandler}
            />
          </div>
          <input type="hidden" name="email" id="email" value={email} />
          <div className={classes["info"]}>
            <p>{verifyEmailInfo}</p>
          </div>
          <div className={classes["warning"]}>
            <p>{verifyEmailWarning}</p>
          </div>

          <input
            type="submit"
            value="Verify"
            className={` ${classes["btn"]} ${classes["btn-primary"]}`}
          />
        </form>

        <div style={{width:"100%",display:"flex",justifyContent:"center"}}> 
          <input
            style={{width:"23%"}}
            onClick={resendOTPOnSubmitHandler}
            value="Resend OTP"
            className={classes["info-btn"]}
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordVerifyEmail;
