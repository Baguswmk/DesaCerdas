// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import useAuthStore from "@/store/auth";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, user } = useAuthStore();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
