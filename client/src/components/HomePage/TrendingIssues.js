import React from "react";

import TrendingCard from "../UI/TrendingCard";

import classes from "./TrendingIssues.module.css";

const TrendingIssues = ({ trendingIssues }) => {
  return (
    <div className={classes["stories"]}>
      {trendingIssues.map((issue) => (
        <TrendingCard key={issue._id} issue={issue} />
      ))}
    </div>
  );
};

export default TrendingIssues;
