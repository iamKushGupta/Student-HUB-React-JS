import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setError, setLoading } from "../../features/user/userSlice";

import classes from "./NavBar.module.css";

const NavBar = ({ logoutHandler, onShowCreateIssue }) => {
  const [path, setPath] = useState("/home");
  const [showPopup, setShowPopup] = useState(false);

  const [searchedUsername, setSearchedUsername] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);

  // State
  const dispatch = useDispatch();
  const { userInfo, userToken } = useSelector((state) => state.user);

  // useLocation
  const location = useLocation();

  // useEffect
  useEffect(() => {
    setPath(location.pathname);
  }, [location]);

  useEffect(() => {
    if (searchedUsername.length > 0) {
      const fetchSearchedUsers = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/data/search/${searchedUsername}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
              },
            }
          );

          const resData = await response.json();

          if (response.status !== 200 && response.status !== 201) {
            dispatch(
              setError(
                `${resData.message ? resData.message : ""} ${
                  resData.data ? resData.data[0].msg : ""
                }` || "Something went wrong."
              )
            );
            return;
          }

          setSearchedUsers(resData.data);
        } catch (err) {
          dispatch(setError(err.message || "Something went wrong."));
        }
      };

      fetchSearchedUsers();
    }
  }, [searchedUsername]);

  const createIssueHandler = () => {
    onShowCreateIssue();
  };

  const showPopupHandler = () => {
    setShowPopup((prev) => {
      return !prev;
    });
  };

  return (
    <div className={classes["parent_container"]}>
      <nav>
        <div className={classes["container"]}>
          <a href="/" style={{ textDecoration: "none", color: "black" }}>
            <h2 className={classes["logo"]}>Student HUB</h2>
          </a>
          <div className={classes["nav-bar-menu"]}>
            <span
              className={`${classes["menu-item"]} ${
                classes[path === "/home" && "active"]
              }`}
            >
              <Link as={Link} to="/home">
                <b>Home</b>
              </Link>
            </span>
            <span
              className={`${classes["menu-item"]} ${
                classes[path === "/explore" && "active"]
              }`}
            >
              <Link as={Link} to="/explore">
                <b>Explore</b>
              </Link>
            </span>
            <span
              className={`${classes["menu-item"]} ${
                classes[path === "/notification" && "active"]
              }`}
              id="notifications"
            >
              <Link as={Link} to="/notification">
                <b>Notification</b>
              </Link>
            </span>
            <span
              className={`${classes["menu-item"]} ${
                classes[path === "/bookmarks" && "active"]
              }`}
            >
              <Link as={Link} to="/bookmarks">
                <b>Bookmarks</b>
              </Link>
            </span>
            <span
              className={`${classes["menu-item"]} ${
                classes[path === "/settings" && "active"]
              }`}
            >
              <Link as={Link} to="/settings">
                <b>Settings</b>
              </Link>
            </span>
          </div>
          <div></div>
          <div className={classes["create"]}>
            <div className={classes["search-bar"]}>
              <i
                className="uil uil-search"
                style={{
                  marginTop: "0.7rem",
                }}
              ></i>
              <input
                id={classes["search-bar-input"]}
                type="search"
                name="username"
                placeholder="Search for users"
                onChange={(e) => {
                  setSearchedUsername(e.target.value);
                }}
                value={searchedUsername}
              />
              <ul className={classes["autocomplete-list"]} id="country-list">
                {searchedUsers.map((user) => {
                  return (
                    <li>
                      <Link
                        as={Link}
                        to={`/profile/${user._id}`}
                        onClick={() => {
                          setSearchedUsername("");
                          setSearchedUsers([]);
                        }}
                      >
                        {user.username}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <label
              id="create-issue-nav-bar"
              style={{ margin: "0rem 0.8rem" }}
              className={`${classes["btn"]} ${classes["btn-primary"]}`}
              onClick={createIssueHandler}
            >
              Create
            </label>
            <div
              id="profile-photo-nav"
              className={classes["profile-photo"]}
              onClick={showPopupHandler}
            >
              <img
                src={
                  userInfo
                    ? userInfo.profilePic
                    : "https://res.cloudinary.com/dxqjyqz8f/image/upload/v1622021008/Student%20Hub%20Images/Profile%20Photos/Profile%20Photo%20Default%20Image.png"
                }
                style={{
                  objectFit: "cover",
                  minWidth: "100%",
                  minHeight: "100%",
                  cursor: "pointer",
                }}
                alt="profile-picture"
              />
            </div>
            {showPopup && (
              <div className={`${classes["menu"]}`} style={{
                marginRight:"90px",
                right:"0px"
              }}id="profile-menu">
                <h3 id={classes["pop-up-username"]}>
                  {userInfo ? userInfo.username : ""}
                  <br />
                </h3>
                <ul>
                  <li>
                    <span>
                      <i className="uil uil-user-circle"></i>
                    </span>
                    <Link
                      as={Link}
                      to={`/profile/${userInfo ? userInfo.id : ""}`}
                    >
                      My profile
                    </Link>
                  </li>

                  <li>
                    <span>
                      <i className="uil uil-edit"></i>
                    </span>
                    <Link as={Link} to="/settings">
                      Edit profile
                    </Link>
                  </li>

                  <li>
                    <span>
                      <i className="uil uil-bookmark"></i>
                    </span>
                    <Link as={Link} to="/bookmarks">
                      Bookmarks
                    </Link>
                  </li>

                  <li
                    onClick={(e) => {
                      logoutHandler();
                    }}
                  >
                    <span>
                      <i className="uil uil-sign-out-alt"></i>
                    </span>
                    <Link as={Link} to="/login">
                      Logout
                    </Link>
                  </li>

                  <p>
                    <Link
                      className={classes["menu-item"]}
                      as={Link}
                      to="/contactus"
                    >
                      <span>Contact Us</span>{" "}
                    </Link>{" "}
                    <Link
                      className={classes["menu-item"]}
                      as={Link}
                      to="/meet-the-team"
                    >
                      <span>About Us</span>
                    </Link>{" "}
                  </p>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
