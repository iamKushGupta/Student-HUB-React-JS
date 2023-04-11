import React from "react";

import classes from "./CategoryCard.module.css";

const CategoryCard = ({ cardImage, cardTitle, cardDescription, categoryValue, fetchCategoryIssues }) => {
  const clickHandler = () => {
    fetchCategoryIssues(categoryValue);
  };

  return (
    <div
      className={classes["category"]}
      style={{ width: "12rem", height: "20rem" }}
      onClick={clickHandler}
    >
      <img src={cardImage} className={classes["card-img-top"]} alt="..." />
      <div className={classes["card-body"]}>
        <h5 className={classes["card-title"]}>{cardTitle}</h5>
        <p className={classes["card-text"]}>{cardDescription}</p>
      </div>
    </div>
  );
};

export default CategoryCard;
