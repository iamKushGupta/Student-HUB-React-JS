import React from "react";
import AdminNavbar from "../Admin/AdminNavbar";

const AdminWrapper = ({ logoutHandler, children }) => {
  return (
    <>
      <AdminNavbar logoutHandler={logoutHandler} />
      {children}
    </>
  );
};

export default AdminWrapper;
