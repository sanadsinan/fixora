import { Link, useLocation } from "react-router-dom";
import "./ExtraPages.css";

function BookingConfirmed() {
  // The booking details are sent from the booking form through the router
  const { state } = useLocation();

  // If someone opens this address directly, there is nothing to show
  if (!state) {
    return (
      <div className="wrap">
        <div
          className="card"
          style={{ maxWidth: 520, margin: "20px auto", padding: 36, textAlign: "center" }}
        >
          <h2 style={{ fontSize: 26 }}>No booking to show</h2>
          <p className="m" style={{ marginTop: 8 }}>
            Choose a service and make a booking first.
          </p>
          <Link
            className="btn"
            to="/services"
            style={{ display: "block", marginTop: 24 }}
          >
            Browse services
          </Link>
        </div>
      </div>
    );
  }

  const rows = [
    ["Service", state.service],
    ["Provider", state.provider],
    ["Date & time", state.when],
    ["Address", state.address],
  ];

  return (
    <div className="wrap">
      <div
        className="card"
        style={{ maxWidth: 520, margin: "20px auto", padding: 36, textAlign: "center" }}
      >
        <div className="success-circle">✓</div>
        <h2 style={{ fontSize: 26, marginTop: 18 }}>Booking request sent!</h2>
        <p className="m" style={{ marginTop: 8, fontSize: 15 }}>
          {state.provider} will confirm your booking soon. You can track it in
          My Bookings.
        </p>

        <div style={{ textAlign: "left", marginTop: 24 }}>
          {rows.map(([label, value]) => (
            <div className="confirm-row" key={label}>
              <span className="m">{label}</span>
              <b>{value}</b>
            </div>
          ))}
          <div className="confirm-row">
            <span className="m">Status</span>
            <b>
              <span className="b w">Pending</span>
            </b>
          </div>
        </div>

        <div className="button-row">
          <Link className="btn" to="/bookings">
            View my bookings
          </Link>
          <Link className="btn btn2" to="/">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmed;