import React from "react";
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setError, setLoading } from "../../../features/user/userSlice";

import styles from "./SignUpVerify.module.css";

const SignUpVerify = () => {
  // useState
  const [email, setEmail] = useState("");
  const [enteredOTP, setEnteredOTP] = useState("");
  const [info, setInfo] = useState("");
  const [warning, setWarning] = useState("");

  // State
  const dispatch = useDispatch();

  // useNavigate
  const navigate = useNavigate();

  // useLocation
  const location = useLocation();

  // useEffect
  useEffect(() => {
    if (location.state) {
      setEmail(location.state?.email);
    } else {
      navigate("/");
    }
  }, [location]);

  // Submit handlers
  const handleSubmitVerifyForm = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    if (enteredOTP === "") {
      dispatch(setError("Please enter the OTP."));
      dispatch(setLoading(false));
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/auth/verify-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otp: enteredOTP,
            email: email,
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
      navigate("/details", {
        state: {
          email: email,
        },
      });
    } catch (err) {
      dispatch(setError(err.message));
    }

    dispatch(setLoading(false));
  };

  return (
    <div className={styles["parent-container"]}>
      <div className={styles.secondaryContainer}>
        <form id="verify-form" onSubmit={handleSubmitVerifyForm} style={{
          padding : "0"
        }}>
          <h1 className={styles.title}>Verify Email</h1>
          <p
            style={{ marginTop: "4%", marginBottom: "2%", fontSize: "1.1rem" }}
          >
            We have sent an OTP to your email address.
          </p>
          <div className={styles["input-field"]}>
            <i className="uil uil-envelope-lock"></i>
            <input
              type="text"
              name="otp"
              id="otp"
              value={enteredOTP}
              onChange={(e) => setEnteredOTP(e.target.value)}
              placeholder="Enter the OTP"
            />
          </div>
          <input type="hidden" name="email" id="email" value={email} />
          <div className={styles.info}>
            <p>{info}</p>
          </div>
          <div className={styles.warning}>
            <p>{warning}</p>
          </div>

          <input
            type="submit"
            value="Verify"
            className={`${styles["btn"]} ${styles["btn-primary"]}`}
          />
        </form>
        <form style={{
          padding : "1rem"
        }}>
          <input type="hidden" name="email" id="email" value={email} />
          <input
            type="submit"
            value="Resend OTP"
            className={styles["info-btn"]}
          />
        </form>
      </div>
    </div>
  );
};

export default SignUpVerify;
