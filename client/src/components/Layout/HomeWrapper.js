import React from "react";

import CreateIssue from "../HomePage/CreateIssue";
import NavBar from "../UI/NavBar";

const HomeWrapper = ({
  createIssueIsShown,
  hideCreateIssue,
  logoutHandler,
  children
}) => {
  return (
    <div className="home-page-container">
      {createIssueIsShown && (
        <CreateIssue onCloseCreateIssue={hideCreateIssue} />
      )}
      <NavBar logoutHandler={logoutHandler} />
      {children}
    </div>
  );
};

export default HomeWrapper;
