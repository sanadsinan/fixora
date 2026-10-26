import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { providers, reviews } from "../data/providers";
import "./ServiceDetail.css";

function ServiceDetail() {
  // Reads the :id part of the address, e.g. /services/3 gives id = "3"
  const { id } = useParams();

  const provider = providers.find((p) => p.id === Number(id));
  const providerReviews = reviews.filter((r) => r.providerId === Number(id));

  const [booking, setBooking] = useState({
    date: "",
    time: "",
    address: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!booking.date || !booking.time || !booking.address) {
      setError("Please choose a date, time and enter your address.");
      return;
    }

    setError("");
    setConfirmed(true);
    console.log("Booking data:", { providerId: provider.id, ...booking });
    // Later we will send this to the backend
  };

  // If the id in the address does not match any provider
  if (!provider) {
    return (
      <div className="wrap">
        <h1 style={{ fontSize: 28 }}>Service not found</h1>
        <p className="m" style={{ marginTop: 8 }}>
          This provider does not exist.
        </p>
        <Link className="btn" to="/services" style={{ marginTop: 20 }}>
          Back to services
        </Link>
      </div>
    );
  }

  return (
    <div className="wrap">
      <Link className="back-link" to="/services">
        ← Back to services
      </Link>

      <div className="detail-layout">
        {/* Left side: provider information */}
        <div className="detail-main">
          <div className="ph" style={{ height: 260 }}>
            Service photo
          </div>

          <h1 style={{ fontSize: 28, marginTop: 20 }}>{provider.service}</h1>
          <p className="m" style={{ marginTop: 6 }}>
            by {provider.name} · {provider.location} · ★ {provider.rating}
          </p>

          <p style={{ marginTop: 16, lineHeight: 1.6 }}>
            {provider.description}
          </p>

          <h2 style={{ fontSize: 20, marginTop: 32 }}>Customer reviews</h2>

          {providerReviews.length > 0 ? (
            providerReviews.map((r) => (
              <div className="card review-card" key={r.id}>
                <b>{r.customer}</b> <span className="m">★ {r.rating}</span>
                <p className="m" style={{ marginTop: 6 }}>
                  {r.comment}
                </p>
              </div>
            ))
          ) : (
            <p className="m" style={{ marginTop: 14 }}>
              No reviews yet.
            </p>
          )}
        </div>

        {/* Right side: booking form */}
        <form className="card detail-booking" onSubmit={handleSubmit}>
          <h2 style={{ fontSize: 20 }}>Book this service</h2>
          <p className="m" style={{ marginTop: 4 }}>
            Price: from ₹{provider.price}
          </p>

          {error && (
            <p className="b x" style={{ marginTop: 14 }}>
              {error}
            </p>
          )}

          {confirmed ? (
            <div className="success-box">
              Booking request sent to {provider.name} for {booking.date} at{" "}
              {booking.time}. You will see its status in My Bookings.
            </div>
          ) : (
            <>
              <label htmlFor="date">Date</label>
              <input
                id="date"
                name="date"
                type="date"
                min={today}
                className="in"
                value={booking.date}
                onChange={handleChange}
              />

              <label htmlFor="time">Time</label>
              <input
                id="time"
                name="time"
                type="time"
                className="in"
                value={booking.time}
                onChange={handleChange}
              />

              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                rows="2"
                className="in"
                value={booking.address}
                onChange={handleChange}
              />

              <label htmlFor="notes">Notes (optional)</label>
              <textarea
                id="notes"
                name="notes"
                rows="2"
                className="in"
                value={booking.notes}
                onChange={handleChange}
              />

              <button
                type="submit"
                className="btn"
                style={{ display: "block", width: "100%", marginTop: 20 }}
              >
                Confirm booking
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default ServiceDetail;