import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { initialBookings } from "../data/bookings";
import "./ExtraPages.css";

function WriteReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const booking = initialBookings.find((b) => b.id === Number(id));

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Only completed bookings can be reviewed
  if (!booking || booking.status !== "Completed") {
    return (
      <div className="wrap">
        <div
          className="card"
          style={{ maxWidth: 560, margin: "20px auto", padding: 32, textAlign: "center" }}
        >
          <h2 style={{ fontSize: 26 }}>Review not available</h2>
          <p className="m" style={{ marginTop: 8 }}>
            You can only review a booking after it is completed.
          </p>
          <Link
            className="btn"
            to="/bookings"
            style={{ display: "block", marginTop: 24 }}
          >
            Back to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please choose a star rating.");
      return;
    }

    setError("");
    setSubmitted(true);
    console.log("Review data:", { bookingId: booking.id, rating, comment });
    // Later we will send this to the backend
  };

  if (submitted) {
    return (
      <div className="wrap">
        <div
          className="card"
          style={{ maxWidth: 560, margin: "20px auto", padding: 36, textAlign: "center" }}
        >
          <div className="success-circle">✓</div>
          <h2 style={{ fontSize: 26, marginTop: 18 }}>Thank you!</h2>
          <p className="m" style={{ marginTop: 8 }}>
            Your review for {booking.provider} has been submitted.
          </p>
          <Link
            className="btn"
            to="/bookings"
            style={{ display: "block", marginTop: 24 }}
          >
            Back to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap">
      <form
        className="card"
        style={{ maxWidth: 560, margin: "20px auto", padding: 32 }}
        onSubmit={handleSubmit}
      >
        <h2 style={{ fontSize: 26 }}>Write a review</h2>

        <div className="review-summary">
          <b>{booking.service}</b>
          <p className="m" style={{ marginTop: 4 }}>
            {booking.provider} · {booking.when}
          </p>
        </div>

        {error && (
          <p className="b x" style={{ marginTop: 14 }}>
            {error}
          </p>
        )}

        <label>Your rating</label>
        <div style={{ marginTop: 4 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              key={n}
              className="star-btn"
              style={{ color: n <= rating ? "#f59e0b" : "#cbd5e1" }}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              onClick={() => setRating(n)}
            >
              ★
            </button>
          ))}
        </div>

        <label htmlFor="comment">Your comment</label>
        <textarea
          id="comment"
          className="in"
          rows="5"
          placeholder="Tell others about your experience"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button type="submit" className="btn" style={{ flex: 1 }}>
            Submit review
          </button>
          <button
            type="button"
            className="btn btn2"
            style={{ flex: 1 }}
            onClick={() => navigate("/bookings")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default WriteReview;