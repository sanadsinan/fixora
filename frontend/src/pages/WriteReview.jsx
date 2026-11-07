import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { formatDate, formatTime } from "../utils/format";
import "./ExtraPages.css";

function WriteReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Find this booking among my bookings
  useEffect(() => {
    api("/api/bookings/mine", { token })
      .then((list) => setBooking(list.find((b) => b.id === Number(id)) || null))
      .catch(() => setBooking(null))
      .finally(() => setLoading(false));
  }, [id, token]);

  if (loading) {
    return (
      <div className="wrap">
        <p className="m">Loading...</p>
      </div>
    );
  }

  // Only completed bookings that are not reviewed yet can be reviewed
  if (!booking || booking.status !== "completed" || booking.reviewed) {
    return (
      <div className="wrap">
        <div
          className="card"
          style={{ maxWidth: 560, margin: "20px auto", padding: 32, textAlign: "center" }}
        >
          <h2 style={{ fontSize: 26 }}>Review not available</h2>
          <p className="m" style={{ marginTop: 8 }}>
            {booking?.reviewed
              ? "You have already reviewed this booking."
              : "You can only review a booking after it is completed."}
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please choose a star rating.");
      return;
    }

    setError("");
    setSaving(true);

    try {
      await api("/api/reviews", {
        method: "POST",
        token,
        body: { bookingId: booking.id, rating, comment },
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
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
            {booking.provider} · {formatDate(booking.date)}, {formatTime(booking.time)}
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
          <button
            type="submit"
            className="btn"
            style={{ flex: 1 }}
            disabled={saving}
          >
            {saving ? "Submitting..." : "Submit review"}
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