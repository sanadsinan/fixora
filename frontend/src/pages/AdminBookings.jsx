import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/format";
import "./AdminPages.css";

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

const statuses = ["All statuses", "Pending", "Confirmed", "Completed", "Cancelled"];

function AdminBookings() {
  const { token } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // What is typed in the boxes
  const [status, setStatus] = useState("All statuses");
  const [date, setDate] = useState("");

  // What was applied when the Filter button was clicked
  const [applied, setApplied] = useState({ status: "All statuses", date: "" });

  useEffect(() => {
    api("/api/admin/bookings", { token })
      .then(setBookings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleFilter = () => setApplied({ status, date });

  const handleClear = () => {
    setStatus("All statuses");
    setDate("");
    setApplied({ status: "All statuses", date: "" });
  };

  const visible = bookings.filter(
    (b) =>
      (applied.status === "All statuses" || label[b.status] === applied.status) &&
      (!applied.date || b.date === applied.date)
  );

  return (
    <div>
      <div className="page-head">
        <h1 style={{ fontSize: 26 }}>All bookings</h1>
      </div>

      <div className="filter-row">
        <select
          className="in"
          aria-label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <input
          className="in"
          type="date"
          aria-label="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button className="btn btn-sm" onClick={handleFilter}>
          Filter
        </button>
        <button className="btn btn2 btn-sm" onClick={handleClear}>
          Clear
        </button>
      </div>

      {error && (
        <p className="b x" style={{ marginTop: 16 }}>
          {error}
        </p>
      )}

      <div className="card tw" style={{ marginTop: 20 }}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Provider</th>
              <th>Service</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", color: "#475569" }}>
                  Loading bookings...
                </td>
              </tr>
            ) : visible.length > 0 ? (
              visible.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.customer}</td>
                  <td>{b.provider}</td>
                  <td>{b.service}</td>
                  <td>{formatDate(b.date)}</td>
                  <td>
                    <span className={badgeClass[b.status]}>{label[b.status]}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", color: "#475569" }}>
                  No bookings match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminBookings;