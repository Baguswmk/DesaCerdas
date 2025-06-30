import { Navigate } from "react-router-dom";
import useAuthStore from "../store/auth";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, user } = useAuthStore();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
