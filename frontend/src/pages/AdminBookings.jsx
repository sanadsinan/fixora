import { useState } from "react";
import { initialAdminBookings } from "../data/adminBookings";
import "./AdminPages.css";

const badgeClass = {
  Pending: "b w",
  Confirmed: "b ok",
  Completed: "b ok",
  Cancelled: "b x",
};

const statuses = ["All statuses", "Pending", "Confirmed", "Completed", "Cancelled"];

// Turns "2026-10-28" into "28 Oct 2026"
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

function AdminBookings() {
  const bookings = initialAdminBookings;

  // What is typed in the boxes
  const [status, setStatus] = useState("All statuses");
  const [date, setDate] = useState("");

  // What was applied when the Filter button was clicked
  const [applied, setApplied] = useState({ status: "All statuses", date: "" });

  const handleFilter = () => setApplied({ status, date });

  const handleClear = () => {
    setStatus("All statuses");
    setDate("");
    setApplied({ status: "All statuses", date: "" });
  };

  const visible = bookings.filter(
    (b) =>
      (applied.status === "All statuses" || b.status === applied.status) &&
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
            {visible.length > 0 ? (
              visible.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.customer}</td>
                  <td>{b.provider}</td>
                  <td>{b.service}</td>
                  <td>{formatDate(b.date)}</td>
                  <td>
                    <span className={badgeClass[b.status]}>{b.status}</span>
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