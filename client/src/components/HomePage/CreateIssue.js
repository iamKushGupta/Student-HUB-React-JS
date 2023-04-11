import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLoading, setError } from "../../features/user/userSlice";
import { toast } from "react-hot-toast";

import Modal from "../UI/Modal";

import classes from "./CreateIssue.module.css";

const CreateIssue = ({ onCloseCreateIssue }) => {
  // useStates
  const [category, setCategory] = useState("electricity");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState();
  const [isValid, setIsValid] = useState(true);

  // State
  const { userInfo, userToken } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // useRef
  const fileInputRef = useRef();

  // useEffect
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

  // onSubmitHandlers
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!description) {
      dispatch(setError("Please fill in all the fields"));
      dispatch(setLoading(false));
      setIsValid(false);
      return;
    }

    setIsValid(true);

    try {
      const formData = new FormData();

      formData.append("category", category);
      formData.append("description", description);
      formData.append("image", image);

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/data/issue/create`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + userToken,
          },
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
          setError(
            `${resData.message ? resData.message : ""} ${
              resData.data ? resData.data[0].msg : ""
            }` || "Something went wrong."
          )
        );
        return;
      }

      window.location.reload();
      dispatch(setError());
      onCloseCreateIssue();

      toast.success("Issue created successfully");
    } catch (err) {
      dispatch(setError(err.message));
    }

    dispatch(setLoading(false));
  };

  return (
    <Modal onClose={onCloseCreateIssue}>
      <div className={classes["wrapper"]}>
        <section className={classes["post"]}>
          <button id={classes["close-modal"]} onClick={onCloseCreateIssue}>
            <b>X</b>
          </button>
          <header>Create Post</header>
          <form
            className={`${!isValid && classes["wrong-input"]}`}
            encType="multipart/form-data"
            onSubmit={onSubmitHandler}
          >
            <div className={classes["content"]}>
              <div className={classes["profile-photo"]}>
                <img
                  src={userInfo ? userInfo.profilePic : ""}
                  style={{
                    objectFit: "cover",
                    minWidth: "100%",
                    minHeight: "100%",
                  }}
                  alt="profile-picture"
                />
              </div>

              <div className={classes["details"]}>
                <div>
                  <p>{userInfo ? userInfo.username : ""}</p>
                  <div className={classes["category"]}>
                    <i className="uil uil-receipt"></i>
                    <select
                      style={{ background: "none" }}
                      name="category"
                      id={classes["category"]}
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="electricity">Electricity</option>
                      <option value="wifi">Wifi</option>
                      <option value="sanitation">Sanitation</option>
                      <option value="mess">Mess</option>
                      <option value="harassment">Harassment</option>
                      <option value="washing-machine">Washing machine</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {preview ? (
              <div
                style={{
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "60% 40%",
                }}
              >
                <textarea
                  className={`${classes["description"]}`}
                  placeholder="What's bugging you?"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: "100%" }}
                ></textarea>
                <div className={classes["image"]}>
                  <img
                    style={{ objectFit: "cover" }}
                    className={classes["display-post-image"]}
                    src={preview}
                    alt=""
                  />
                </div>
              </div>
            ) : (
              <textarea
                className={classes["description"]}
                placeholder="What's bugging you?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                name="description"
              ></textarea>
            )}

            <button
              className={classes["options"]}
              type="button"
              style={{ cursor: "pointer" }}
              onClick={(event) => {
                event.preventDefault();
                fileInputRef.current.click();
              }}
            >
              <p>Add a file to your post</p>
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
            <button
              className={`${classes["btn"]} ${classes["btn-primary"]}`}
              id={classes["post_button"]}
            >
              Post
            </button>
          </form>
        </section>
      </div>
    </Modal>
  );
};

export default CreateIssue;
