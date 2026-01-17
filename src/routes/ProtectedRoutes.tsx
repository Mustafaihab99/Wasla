import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles }: { allowedRoles?: string[] }) {
  const token = localStorage.getItem("auth_token");
  const role = sessionStorage.getItem("role"); 

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role || "")) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
