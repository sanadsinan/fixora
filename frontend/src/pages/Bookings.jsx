import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { formatDate, formatTime } from "../utils/format";
import "./Bookings.css";

// The server uses lowercase words, and this page shows friendlier ones
const label = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

const badgeClass = {
  pending: "b w",
  confirmed: "b ok",
  completed: "b ok",
  cancelled: "b x",
};

const tabs = ["All", "Pending", "Confirmed", "Completed"];

function Bookings() {
  const { token } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load my real bookings from the server
  useEffect(() => {
    api("/api/bookings/mine", { token })
      .then(setBookings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const visibleBookings =
    filter === "All"
      ? bookings
      : bookings.filter((b) => label[b.status] === filter);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      const updated = await api(`/api/bookings/${id}/cancel`, {
        method: "PATCH",
        token,
      });
      setBookings(bookings.map((b) => (b.id === id ? updated : b)));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  // Decides what to show in the Action column
  const renderAction = (b) => {
    if (b.status === "pending" || b.status === "confirmed") {
      return (
        <button className="link-btn" onClick={() => handleCancel(b.id)}>
          Cancel
        </button>
      );
    }
    if (b.status === "completed") {
      return b.reviewed ? (
        <span className="m">Reviewed</span>
      ) : (
        <Link className="link-btn" to={`/bookings/${b.id}/review`}>
          Write review
        </Link>
      );
    }
    return "–";
  };

  return (
    <div className="wrap">
      <h1 style={{ fontSize: 28 }}>My bookings</h1>

      {/* Filter buttons */}
      <div className="filter-tabs">
        {tabs.map((name) => (
          <button
            key={name}
            className={filter === name ? "btn" : "btn btn2"}
            onClick={() => setFilter(name)}
          >
            {name}
          </button>
        ))}
      </div>

      {error && (
        <p className="b x" style={{ marginTop: 16 }}>
          {error}
        </p>
      )}

      {/* Bookings table */}
      <div className="card tw" style={{ marginTop: 20 }}>
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Provider</th>
              <th>Date &amp; time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="empty-row">
                  Loading your bookings...
                </td>
              </tr>
            ) : visibleBookings.length > 0 ? (
              visibleBookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.service}</td>
                  <td>{b.provider}</td>
                  <td>
                    {formatDate(b.date)}, {formatTime(b.time)}
                  </td>
                  <td>
                    <span className={badgeClass[b.status]}>{label[b.status]}</span>
                  </td>
                  <td>{renderAction(b)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-row">
                  {bookings.length === 0 ? (
                    <>
                      You have no bookings yet. <Link to="/services">Find a service</Link>
                    </>
                  ) : (
                    "No bookings in this tab."
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Bookings;