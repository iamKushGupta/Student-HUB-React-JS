import React from "react";
import { Link } from "react-router-dom";

import classes from "./UserProfile.module.css";

const UserProfile = ({ user }) => {
  if (!user) {
    return <></>;
  }

  return (
    <Link
      as={Link}
      to={user.id ? `/profile/${user.id}` : `/profile/${user._id}`}
      className={classes["profile"]}
    >
      <div className={classes["profile-photo"]}>
        <img
          src={user.profilePic}
          style={{ objectFit: "cover", minWidth: "100%", minHeight: "100%" }}
          alt="profile-picture"
        />
      </div>
      <div className={classes["handle"]}>
        <h4>{user.username}</h4>
        <p className={classes["text-muted"]}>{user.email}</p>
      </div>
    </Link>
  );
};

export default UserProfile;
