import { NavLink, Link, Outlet } from "react-router-dom";
import "./DashboardLayout.css";

// "out: true" marks the Log out button, which has its own style
const menus = {
  provider: [
    { label: "Dashboard", to: "/provider", end: true },
    { label: "My services", to: "/provider/services" },
    { label: "Booking requests", to: "/provider/requests" },
    { label: "Profile", to: "/provider/profile" },
    { label: "Log out", to: "/login", out: true },
  ],
  admin: [
    { label: "Dashboard", to: "/admin", end: true },
    { label: "Users & providers", to: "/admin/users" },
    { label: "Categories", to: "/admin/categories" },
    { label: "All bookings", to: "/admin/bookings" },
    { label: "Reviews", to: "/admin/reviews" },
    { label: "Log out", to: "/login", out: true },
  ],
};

function DashboardLayout({ role }) {
  return (
    <div className="side">
      <div className="sb">
        <Link className="logo" to="/">
          <span className="lf">Fix</span>ora{role === "admin" ? " Admin" : ""}
        </Link>

        {menus[role].map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.end}
            className={({ isActive }) => {
              if (item.out) return "out";
              return isActive ? "on" : "";
            }}
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="dash-content">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;