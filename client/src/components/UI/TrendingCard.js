import React from "react";
import { Link } from "react-router-dom";

import classes from './TrendingCard.module.css'

const TrendingCard = ({issue}) => {

  return (
    <div
      key={issue.id}
      className={classes["story"]}
    >
      <img 
        src={issue.postImage}
        style={{
          objectFit: "cover",
          minWidth: "100%",
          minHeight: "100%",
          zIndex: "0",
          position: "absolute",
        }}
      />
      <div className={classes["profile-photo"]} style={{
        zIndex: "50",
      }}>
        <img
          src={issue.postedBy.profilePic}
          style={{
            objectFit: "cover",
            minWidth: "100%",
            minHeight: "100%",
          }}
          alt="profile"
        />
      </div>
      <Link
        as={Link}
        to={`/profile/${issue.postedBy._id}`}
        style={{
          textDecoration: "none",
          color: "white",
          zIndex: "50",
        }}
      >
        {issue.postedBy.username}
      </Link>
    </div>
  );
};

export default TrendingCard;
