import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { setError, setLoading } from "../../features/user/userSlice";

import classes from "./AdminUserComp.module.css";

import administrator from "../../assets/administrator.png";
import delete_button from "../../assets/delete-button.png";

const AdminUserComp = ({ user }) => {
  const dispatch = useDispatch();
  const { userToken } = useSelector((state) => state.user);

  const deleteButtonHandler = async (event) => {
    event.preventDefault();

    // Create alert if yes and no for delete

    alert("Are you sure you want to delete this user?");

    await deleteUser();
  };

  const deleteUser = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin/deleteUser/${user._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const resData = await response.json();

      if (response.status === 422) {
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

      if (response.status !== 200 && response.status !== 201) {
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
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  const adminButtonHandler = async (event) => {
    event.preventDefault();

    // Create alert if yes and no for admin

    alert("Are you sure you want to make this user an admin?");

    await makeAdmin();
  };

  const makeAdmin = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin/makeAdmin/${user._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const resData = await response.json();

      if (response.status === 422) {
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

      if (response.status !== 200 && response.status !== 201) {
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
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  return (
    <a className={classes["profile"]}>
      <div className={classes["content"]}>
        <div className={classes["profile-photo"]}>
          <img
            src={user.profilePic}
            style={{
              objectFit: "cover",
            }}
          />
        </div>
        <div className={classes["handle"]}>
          <h4>{user.username}</h4>
          <p className={classes["text-muted"]}>{user.email}</p>
        </div>
      </div>
      <div className={classes["action-buttons"]}>
        <img
          className={`${classes["add-admin-button"]} ${classes["liked-img"]}`}
          src={administrator}
          style={{ width: "15px", alignItems: "center" }}
          onClick={adminButtonHandler}
        />
        <img
          className={`${classes["delete-user-button"]} ${classes["liked-img"]}`}
          src={delete_button}
          style={{ width: "15px", alignItems: "center" }}
          onClick={deleteButtonHandler}
        />
      </div>
    </a>
  );
};

export default AdminUserComp;
