import { useState } from "react";
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

  // Review form state
  const [reviewingId, setReviewingId] = useState(null);
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");

  const visibleBookings =
    filter === "All" ? bookings : bookings.filter((b) => b.status === filter);

  const handleCancel = (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    setBookings(
      bookings.map((b) => (b.id === id ? { ...b, status: "Cancelled" } : b))
    );
  };

  const openReview = (id) => {
    setReviewingId(id);
    setRating("5");
    setComment("");
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();

    console.log("Review data:", { bookingId: reviewingId, rating, comment });
    // Later we will send this to the backend

    setBookings(
      bookings.map((b) => (b.id === reviewingId ? { ...b, reviewed: true } : b))
    );
    setReviewingId(null);
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
        <button className="link-btn" onClick={() => openReview(b.id)}>
          Write review
        </button>
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

      {/* Review form (shown after clicking "Write review") */}
      {reviewingId && (
        <form className="card review-box" onSubmit={handleReviewSubmit}>
          <h3>Write a review</h3>

          <label htmlFor="rating">Rating</label>
          <select
            id="rating"
            className="in"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="5">5 – Excellent</option>
            <option value="4">4 – Good</option>
            <option value="3">3 – Average</option>
            <option value="2">2 – Poor</option>
            <option value="1">1 – Very poor</option>
          </select>

          <label htmlFor="comment">Comment</label>
          <textarea
            id="comment"
            rows="3"
            className="in"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button type="submit" className="btn">
              Submit review
            </button>
            <button
              type="button"
              className="btn btn2"
              onClick={() => setReviewingId(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Bookings;