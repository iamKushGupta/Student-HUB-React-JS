import { Navigate, Outlet } from "react-router-dom/dist";
import { useSelector } from "react-redux";

const AdminRoutes = () => {
  const { loading, error, isLoggedIn, isAdmin } = useSelector(
    (state) => state.user
  );

  if (loading) {
    return <></>;
  }

  console.log("isLoggedIn: ", isLoggedIn);
  console.log("isAdmin: ", isAdmin);
  
  if (isLoggedIn && isAdmin) {
    return <Outlet />;
  } else if (isLoggedIn && !isAdmin) {
    return <Navigate to="/home" />;
  }

  return <Navigate to="/login" />;
};

export default AdminRoutes;