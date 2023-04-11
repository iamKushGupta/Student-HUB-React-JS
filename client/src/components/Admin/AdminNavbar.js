import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import styles from "./AdminNavbar.module.css";

const AdminNavbar = ({logoutHandler}) => {
  const [path, setPath] = useState("/home");

  // useLocation
  const location = useLocation();

  useEffect(() => {
    setPath(location.pathname);
  }, [location]);

  return (
    <nav>
      <div className={styles["container"]}>
        <Link
          as={Link}
          to="/admin/posts"
          style={{
            textDecoration: "none",
            color: "black",
          }}
        >
          <h2 className={styles["logo"]}>Admin @ Student HUB</h2>
        </Link>
        <div className={styles["nav-bar-menu"]}>
          <Link
            as={Link}
            className={`${styles["menu-item"]} ${
              path === "/admin/posts" ? styles["active"] : ""
            }`}
            to="/admin/posts"
          >
            <span>
              <b>Posts</b>
            </span>
          </Link>
          <Link
            as={Link}
            className={`${styles["menu-item"]} ${
              path === "/admin/users" ? styles["active"] : ""
            }`}
            to="/admin/users"
          >
            <span>
              <b>Users</b>
            </span>
          </Link>

          <label
            id="logout-button"
            style={{ margin: "0rem 0.8rem" }}
            className={`${styles["btn"]} ${styles["btn-primary"]}`}
            onClick={(e) => {
              logoutHandler();
            }}
          >
            Logout
          </label>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
