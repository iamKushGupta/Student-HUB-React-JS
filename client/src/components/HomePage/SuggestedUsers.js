import React from "react";
import UserProfile from "../UI/UserProfile";

import classes from "./SuggestedUsers.module.css";

const SuggestedUser = ({ suggestedUsers }) => {
  return (
    <div className={classes["suggested-users"]}>
      <div className={classes["heading"]}>
        <h4>Suggested Users</h4>
        <i className="uil uil-users-alt"></i>
      </div>

      {suggestedUsers.map((user) => (
        <UserProfile key={user._id} user={user} />
      ))}
    </div>
  );
};

export default SuggestedUser;
