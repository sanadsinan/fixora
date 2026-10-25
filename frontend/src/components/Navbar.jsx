import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

// NavLink tells us if this link is the current page
const linkClass = ({ isActive }) => (isActive ? "active" : "");

function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

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
        <NavLink to="/about" className={linkClass} onClick={close}>
          About
        </NavLink>
        <NavLink to="/login" className={linkClass} onClick={close}>
          Login
        </NavLink>
        <Link className="btn" to="/register" onClick={close}>
          Sign up
        </Link>
      </div>
    </div>
  );
}

export default Navbar;