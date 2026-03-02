import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../components/common/Loader";
const PermissionRoute = ({ children, permission }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  const userPermissions = user?.permissions || [];

  if (!userPermissions.includes(permission)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PermissionRoute;
