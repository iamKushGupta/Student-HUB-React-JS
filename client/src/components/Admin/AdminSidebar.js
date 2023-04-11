import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import styles from "./AdminSidebar.module.css";

const AdminSidebar = ({ logoutHandler }) => {
  const [path, setPath] = useState("/home");

  // useLocation
  const location = useLocation();

  useEffect(() => {
    setPath(location.pathname);
  }, [location]);
  return (
    <div className={styles["sidebar"]}>
      <Link
        as={Link}
        className={`${styles["menu-item"]} ${
          path === "/admin/posts" ? styles["active"] : ""
        }`}
        to="/admin/posts"
      >
        <span>
          <i className="uil uil-compass"></i>
        </span>
        <h3>Posts</h3>
      </Link>
      <Link
        as={Link}
        className={`${styles["menu-item"]} ${
          path === "/admin/users" ? styles["active"] : ""
        }`}
        to="/admin/users"
      >
        <span>
          <i className="uil uil-user"></i>
        </span>
        <h3>Users</h3>
      </Link>
      <label
        onClick={(e) => {
          logoutHandler();
        }}
        className={`${styles["menu-item"]} ${
          path === "/admin/users" ? styles["active"] : ""
        }`}
      >
        <span>
          <i className="uil uil-exit"></i>
        </span>
        <h3>Users</h3>
      </label>
    </div>
  );
};

export default AdminSidebar;
