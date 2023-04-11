import { Navigate, Outlet } from "react-router-dom/dist";
import { useSelector } from "react-redux";

const PrivateRoutes = () => {
  const { loading, error, isLoggedIn, isAdmin } = useSelector(
    (state) => state.user
  );

  if (loading) {
    return <></>;
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
