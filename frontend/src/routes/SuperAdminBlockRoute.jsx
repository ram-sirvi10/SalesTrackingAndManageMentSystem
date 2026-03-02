import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const SuperAdminBlockRoute = () => {
  const { user } = useAuth();

  if (user?.superAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default SuperAdminBlockRoute;
