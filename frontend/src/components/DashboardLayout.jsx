import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./DashboardLayout.css";

// "out: true" marks the Log out button, which is a real button now
const menus = {
  provider: [
    { label: "Dashboard", to: "/provider", end: true },
    { label: "My services", to: "/provider/services" },
    { label: "Booking requests", to: "/provider/requests" },
    { label: "Profile", to: "/provider/profile" },
    { label: "Log out", out: true },
  ],
  admin: [
    { label: "Dashboard", to: "/admin", end: true },
    { label: "Users & providers", to: "/admin/users" },
    { label: "Categories", to: "/admin/categories" },
    { label: "All bookings", to: "/admin/bookings" },
    { label: "Reviews", to: "/admin/reviews" },
    { label: "Log out", out: true },
  ],
};

function DashboardLayout({ role }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="side">
      <div className="sb">
        <Link className="logo" to="/">
          <span className="lf">Fix</span>ora{role === "admin" ? " Admin" : ""}
        </Link>

        {menus[role].map((item) =>
          item.out ? (
            <button
              key={item.label}
              type="button"
              className="out"
              onClick={handleLogout}
            >
              {item.label}
            </button>
          ) : (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? "on" : "")}
            >
              {item.label}
            </NavLink>
          )
        )}
      </div>

      <div className="dash-content">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;