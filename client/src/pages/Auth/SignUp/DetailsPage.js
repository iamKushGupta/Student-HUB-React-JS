import React from "react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setError, setLoading } from "../../../features/user/userSlice";

import classes from "./DetailsPage.module.css";

const DetailsPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState();
  const [preview, setPreview] = useState();
  const [inputType, setInputType] = useState("password");
  const [warning, setWarning] = useState("");

  // State
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef();

  useEffect(() => {
    const state = location.state;
    if (state) {
      setEmail(state.email);
    }
  }, [navigate]);

  useEffect(() => {
    if (image) {

      
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreview(fileReader.result);
      };
      fileReader.readAsDataURL(image);
    } else {
      setPreview(null);
    }
  }, [image]);

  const onSubmitSignUpHandler = async (e) => {
    e.preventDefault();

    dispatch(setLoading(true));

    if (password.length < 8) {
      dispatch(setError("Password must be at least 8 characters long"));
      dispatch(setLoading(false));
      return;
    }

    if (password !== confirmPassword) {
      dispatch(setError("Passwords do not match"));
      dispatch(setLoading(false));
      return;
    }

    try {
      const formData = new FormData();

      formData.append("email", email);
      formData.append("username", username);
      formData.append("password", password);
      formData.append("confirmPassword",confirmPassword);
      formData.append("image", image);

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/auth/sign-up`,
        {
          method: "PUT",
          body: formData,
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
          setError(`${resData.message ? resData.message : ""} ${
            resData.data ? resData.data[0].msg : ""
          }` || "Something went wrong."
        ));
        dispatch(setLoading(false));
        return;
      }

      dispatch(setLoading(false));
      dispatch(setError());
      navigate("/", {});
    } catch (err) {
      dispatch(setError(err.message));
    }

    dispatch(setLoading(false));
  };

  return (
    <div className={classes["parent-container"]}>
      <form
        className={classes.container}
        encType="multipart/form-data"
        id={classes["register-form"]}
        onSubmit={onSubmitSignUpHandler}
      >
        <input
          type="hidden"
          name="email"
          id="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />

        <span className={classes["big-circle"]} />
        <h2 className={classes["title"]}>Enter your details</h2>

        <div className={classes["wrapper"]}>
          {preview ? (
            <div className={classes["image"]}>
              <img src={preview} alt="" />
            </div>
          ) : (
            <div className={classes["text"]}>Profile pic!</div>
          )}
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            fileInputRef.current.click();
          }}
          id={classes["custom-btn"]}
        >
          Choose a file
        </button>

        <input
          className={classes["default-btn"]}
          type="file"
          id="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={(event) => {
            const file = event.target.files[0];
            if (file && file.type.substring(0, 5) === "image") {
              setImage(file);
            } else {
              setImage(null);
            }
          }}
          hidden
        />

        <div className={classes["input-field"]}>
          <i className="uil uil-user"></i>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>
        <div className={classes["input-field"]}>
          <i className="uil uil-lock"></i>
          <input
            type={inputType}
            name="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <div className={classes["input-field"]}>
          <i className="uil uil-lock"></i>
          <input
            type={inputType}
            name="confirm_password"
            id="confirm_password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
        </div>
        <div style={{ marginTop: "2px" }}>
          <input
            id="checkbox"
            type="checkbox"
            onClick={() => {
              document.getElementById("checkbox").checked
                ? setInputType("text")
                : setInputType("password");
            }}
            style={{ fontSize: "14px" }}
          />
          <p
            style={{
              display: "inline-block",
              fontSize: "16px",
              margin: "4px 6px",
              opacity: "0.5",
            }}
          >
            Show password
          </p>
        </div>
        <div className={classes["warning"]}>
          <p>{warning}</p>
        </div>

        <input
          type="submit"
          value="Sign up"
          className={`${classes["btn"]} ${classes["btn-primary"]}`}
        />
      </form>
    </div>
  );
};

export default DetailsPage;
