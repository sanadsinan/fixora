import { Link } from "react-router-dom";
import "./ExtraPages.css";

function NotFound() {
  return (
    <div className="wrap" style={{ textAlign: "center", paddingTop: 96 }}>
      <h1 className="big-404">404</h1>
      <h2 style={{ fontSize: 28, marginTop: 12 }}>Page not found</h2>
      <p className="m" style={{ margin: "10px auto 0", maxWidth: 420, fontSize: 16 }}>
        Sorry, the page you are looking for does not exist or may have been
        moved.
      </p>

      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: 28,
        }}
      >
        <Link className="btn" to="/">
          Go to Home
        </Link>
        <Link className="btn btn2" to="/services">
          Browse services
        </Link>
      </div>
    </div>
  );
}

export default NotFound;