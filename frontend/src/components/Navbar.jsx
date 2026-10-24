import { useState } from "react";
import { Link } from "react-router-dom";

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
        <Link to="/" onClick={close}>Home</Link>
        <Link to="/services" onClick={close}>Services</Link>
        <Link to="/about" onClick={close}>About</Link>
        <Link to="/login" onClick={close}>Login</Link>
        <Link className="btn" to="/register" onClick={close}>Sign up</Link>
      </div>
    </div>
  );
}

export default Navbar;