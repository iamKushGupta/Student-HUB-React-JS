import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setError,
  setLoading,
  setUserInfo,
} from "../../features/user/userSlice";
import { toast } from "react-hot-toast";

import Sidebar from "../../components/HomePage/Sidebar";
import SuggestedUser from "../../components/HomePage/SuggestedUsers";

import classes from "./SettingsPage.module.css";

const SettingsPage = ({ onShowCreateIssue }) => {
  // State
  const { userInfo, userToken } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // useStates
  const [image, setImage] = useState();
  const [preview, setPreview] = useState(null);
  const [username, setUsername] = useState(userInfo.username);
  const [email, setEmail] = useState(userInfo.email);
  const [usernameIsValid, setUsernameIsValid] = useState(true);
  const [emailIsValid, setEmailIsValid] = useState(true);

  const [fetchedSuggestedUsers, setFetchedSuggestedUsers] = useState([]);

  const fetchSuggestedUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/data/users/suggessted`,
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

      setFetchedSuggestedUsers(resData.data);
    } catch (err) {
      dispatch(setError(err.message));
    }

    dispatch(setLoading(false));
  }, [dispatch, userToken]);

  const fileInputRef = useRef();

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

  useEffect(() => {
    fetchSuggestedUsers();
  }, [fetchSuggestedUsers]);

  const onSubmitSignUpHandler = async (e) => {
    e.preventDefault();

    if (username.length < 5) {
      setUsernameIsValid(false);
      dispatch(setError("Username must be at least 5 characters long"));
      return;
    } else {
      setUsernameIsValid(true);
    }

    if (email.includes("@") === false) {
      setEmailIsValid(false);
      dispatch(setError("Enter a valid email"));
      return;
    } else {
      setEmailIsValid(true);
    }

    if (preview !== null && !image) {
      dispatch(setError("Please select a profile picture"));
      return;
    }

    if (usernameIsValid && emailIsValid) {
      try {
        const formData = new FormData();

        formData.append("username", username);
        formData.append("email", email);
        formData.append("image", image);

        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/data/settings`,
          {
            method: "POST",
            body: formData,
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
          return;
        }

        dispatch(
          setUserInfo({
            id: resData.data.userId,
            email: resData.data.email,
            username: resData.data.username,
            profilePic: resData.data.profilePic,
          })
        );

        localStorage.setItem("email", resData.data.email);
        localStorage.setItem("username", resData.data.username);
        localStorage.setItem("profilePic", resData.data.profilePic);
      } catch (err) {
        dispatch(setError(err.message));
      }
    }
  };

  return (
    <div className={classes["parent-container"]}>
      <main>
        <div className={classes["container"]}>
          <div className={classes["left"]}>
            <Sidebar
              user={userInfo}
              onShowCreateIssue={onShowCreateIssue}
              isProfile={false}
            />
          </div>

          <div className={classes["middle"]}>
            <h3 className={classes["setting-page"]}>Settings</h3>
            <form
              className={classes["form-container"]}
              encType="multipart/form-data"
              onSubmit={onSubmitSignUpHandler}
              id={classes["register-form"]}
              style={{
                zIndex: "0",
              }}
            >
              <div className={classes["wrapper"]}>
                {preview ? (
                  <div className={classes["image"]}>
                    <img src={preview} alt="" />
                  </div>
                ) : (
                  <div className={classes["image"]}>
                    <img src={userInfo ? userInfo.profilePic : ""} alt="" />
                  </div>
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
                Choose
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

              <div
                className={`${classes["input-container"]} ${
                  !usernameIsValid && classes["wrong-input"]
                }`}
                style={{ marginTop: "1rem" }}
              >
                <label className={classes["input-label"]}>Username</label>
                <div className={classes["input-field"]}>
                  <i className="uil uil-user"></i>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div
                className={`${classes["input-container"]} ${
                  !emailIsValid && classes["wrong-input"]
                }`}
              >
                <label className={classes["input-label"]}>Email</label>
                <div className={classes["input-field"]}>
                  <i className="uil uil-at"></i>
                  <input
                    name="email"
                    id="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <input
                type="submit"
                value="Save changes"
                style={{ width: "100%", maxWidth: "200px" }}
                className={`${classes["btn"]} ${classes["btn-primary"]}`}
              />
            </form>
          </div>

          <div className={classes["right"]}>
            <SuggestedUser suggestedUsers={fetchedSuggestedUsers} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
