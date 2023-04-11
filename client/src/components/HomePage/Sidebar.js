import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Nav } from "react-bootstrap";

import UserProfile from "../UI/UserProfile";

import classes from "./Sidebar.module.css";
import { setError, setLoading } from "../../features/user/userSlice";

const Sidebar = ({ isProfile, user, onShowCreateIssue }) => {
  const [path, setPath] = useState("/home");
  const [isFollowing, setIsFollowing] = useState(false);

  // State
  const dispatch = useDispatch();
  const { userInfo, userToken } = useSelector((state) => state.user);

  // useLocation
  const location = useLocation();

  // useEffect
  useEffect(() => {
    setPath(location.pathname);
  }, [location]);

  const createIssueHandler = () => {
    onShowCreateIssue();
  };

  const checkFollowStatus = useCallback(async () => {
    if (!user._id) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/data/follow-status/${user._id}`,
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

      setIsFollowing(resData.data);
    } catch (err) {
      dispatch(setError(err.message));
    }

    dispatch(setLoading(false));
  }, [dispatch, user._id, userToken]);

  useEffect(() => {
    if (isProfile && user && user._id !== userInfo.id) checkFollowStatus();
  }, [checkFollowStatus, isProfile, user, userInfo]);

  const followHandler = async () => {
    try {
      setLoading(true);

      console.log("user._id", user._id);

      let res;

      if (isFollowing) {
        res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/data/user/unfollow`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              unfollowUserId: user._id,
            }),
          }
        );
      } else {
        res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/data/user/follow`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              followUserId: user._id,
            }),
          }
        );
      }

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

      setIsFollowing((prevState) => !prevState);
    } catch (err) {
      dispatch(setError(err.message));
    }

    dispatch(setLoading(false));
  };

  return (
    <div>
      <div className={classes["sidebar__profile"]}>
        <UserProfile user={user} />
      </div>

      <div className={classes["sidebar"]}>
        <span
          className={`${classes["menu-item"]} ${
            classes[path === "/home" && "active"]
          }`}
        >
          <Nav.Link as={Link} to="/home">
            <i className="uil uil-home"></i>
          </Nav.Link>
          <h3>Home</h3>
        </span>
        <span
          className={`${classes["menu-item"]} ${
            classes[path === "/explore" && "active"]
          }`}
        >
          <Nav.Link as={Link} to="/explore">
            <i className="uil uil-compass"></i>
          </Nav.Link>
          <h3>Explore</h3>
        </span>
        <span
          className={`${classes["menu-item"]} ${
            classes[path === "/notification" && "active"]
          }`}
          id="notifications"
        >
          <span>
            <Nav.Link as={Link} to="/notification">
              <i className="uil uil-bell" />
            </Nav.Link>
          </span>
          <h3>Notification</h3>
        </span>
        <span
          className={`${classes["menu-item"]} ${
            classes[path === "/bookmarks" && "active"]
          }`}
        >
          <Nav.Link as={Link} to="/bookmarks">
            <i className="uil uil-bookmark"></i>
          </Nav.Link>
          <h3>Bookmarks</h3>
        </span>
        <span
          className={`${classes["menu-item"]} ${
            classes[path === "/settings" && "active"]
          }`}
        >
          <Nav.Link as={Link} to="/settings">
            <i className="uil uil-setting"></i>
          </Nav.Link>
          <h3>Settings</h3>
        </span>
      </div>

      {!isProfile && (
        <label
          id="create-issue-side-bar"
          className={`${classes["btn"]} ${classes["btn-primary"]}`}
          onClick={createIssueHandler}
        >
          Create Post
        </label>
      )}

      {isProfile && user && user._id !== userInfo.id && (
        <label
          id="follow-side-bar"
          className={`${classes["btn"]} ${classes["btn-primary"]}`}
          onClick={followHandler}
        >
          {isFollowing ? `Unfollow user` : `Follow user`}
        </label>
      )}
    </div>
  );
};

export default Sidebar;
