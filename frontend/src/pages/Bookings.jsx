import { useState } from "react";
import { Link } from "react-router-dom";
import { initialBookings } from "../data/bookings";
import "./Bookings.css";

// Which badge color to use for each status
const badgeClass = {
  Pending: "b w",
  Confirmed: "b ok",
  Completed: "b ok",
  Cancelled: "b x",
};

const tabs = ["All", "Pending", "Confirmed", "Completed"];

function Bookings() {
  const [bookings, setBookings] = useState(initialBookings);
  const [filter, setFilter] = useState("All");

  const visibleBookings =
    filter === "All" ? bookings : bookings.filter((b) => b.status === filter);

  const handleCancel = (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    setBookings(
      bookings.map((b) => (b.id === id ? { ...b, status: "Cancelled" } : b))
    );
  };

  // Decides what to show in the Action column
  const renderAction = (b) => {
    if (b.status === "Pending" || b.status === "Confirmed") {
      return (
        <button className="link-btn" onClick={() => handleCancel(b.id)}>
          Cancel
        </button>
      );
    }
    if (b.status === "Completed") {
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
            {visibleBookings.length > 0 ? (
              visibleBookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.service}</td>
                  <td>{b.provider}</td>
                  <td>{b.when}</td>
                  <td>
                    <span className={badgeClass[b.status]}>{b.status}</span>
                  </td>
                  <td>{renderAction(b)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-row">
                  No bookings found.
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