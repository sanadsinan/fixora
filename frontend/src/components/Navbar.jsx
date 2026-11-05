import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// NavLink tells us if this link is the current page
const linkClass = ({ isActive }) => (isActive ? "active" : "");

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false); // the phone menu
  const [profileOpen, setProfileOpen] = useState(false); // the profile dropdown
  const profileRef = useRef(null);

  const close = () => {
    setOpen(false);
    setProfileOpen(false);
  };

  // Close the dropdown when the user clicks anywhere outside it
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    close();
    navigate("/");
  };

  // What the menu shows depends on the account type
  const dashboardLink =
    user?.role === "admin" ? "/admin" : user?.isProvider ? "/provider" : null;
  const profileLink =
    user?.role === "provider" ? "/provider/profile" : user?.role === "customer" ? "/profile" : null;

  return (
    <div className="nav">
      <Link className="logo" to="/" onClick={close}>
        <span className="lf">Fix</span>ora
      </Link>

      <button
        className="menu-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? "✕" : "☰"}
      </button>

      <div className={open ? "nav-links open" : "nav-links"}>
        <NavLink to="/" end className={linkClass} onClick={close}>
          Home
        </NavLink>
        <NavLink to="/services" className={linkClass} onClick={close}>
          Services
        </NavLink>

        {/* Logged out */}
        {!user && (
          <>
            <NavLink to="/about" className={linkClass} onClick={close}>
              About
            </NavLink>
            <NavLink to="/login" className={linkClass} onClick={close}>
              Login
            </NavLink>
            <Link className="btn" to="/register" onClick={close}>
              Sign up
            </Link>
          </>
        )}

        {/* Logged in */}
        {user?.role === "customer" && (
          <NavLink to="/bookings" className={linkClass} onClick={close}>
            My Bookings
          </NavLink>
        )}
        {dashboardLink && (
          <NavLink to={dashboardLink} className={linkClass} onClick={close}>
            Dashboard
          </NavLink>
        )}

        {user && (
          <div className="profile-wrap" ref={profileRef}>
            <button
              type="button"
              className="profile-btn"
              aria-label="Profile menu"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              {user.photo ? (
                <img className="profile-photo" src={user.photo} alt="" />
              ) : (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
                </svg>
              )}
            </button>

            <div className={profileOpen ? "card profile-menu open" : "card profile-menu"}>
              <p className="profile-name">{user.name}</p>
              {profileLink && (
                <Link to={profileLink} onClick={close}>
                  My Profile
                </Link>
              )}
              <Link to="/change-password" onClick={close}>
                Change Password
              </Link>
              <button type="button" onClick={handleLogout}>
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;