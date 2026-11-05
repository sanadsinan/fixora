import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const homeFor = { customer: "/", provider: "/provider", admin: "/admin" };

// Wraps pages that need a login, and optionally a certain account type
function ProtectedRoute({ roles }) {
  const { user } = useAuth();
  const location = useLocation();

  // Not logged in: go to the login page
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // A customer who applied as a provider can use both sides
  const mine = [user.role];
  if (user.isProvider) mine.push("provider");

  // Logged in, but the wrong account type: go to your own home
  if (roles && !roles.some((r) => mine.includes(r))) {
    return <Navigate to={homeFor[user.role]} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;