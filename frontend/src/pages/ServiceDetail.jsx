import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import ProviderAvatar from "../components/ProviderAvatar";
import ServiceIllustration from "../components/ServiceIllustration";
import { formatDate, formatTime } from "../utils/format";
import "./ServiceDetail.css";

function ServiceDetail() {
  // Reads the :id part of the address, e.g. /services/3 gives id = "3"
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serviceId, setServiceId] = useState("");

  const [booking, setBooking] = useState({
    date: "",
    time: "",
    address: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // Load this provider from the server
  useEffect(() => {
    setLoading(true);
    api(`/api/providers/${id}`)
      .then((data) => {
        setProvider(data);
        setServiceId(data.services[0] ? String(data.services[0].id) : "");
      })
      .catch(() => setProvider(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Booking needs a login. After logging in, the user comes back here.
    if (!user) {
      navigate("/login", { state: { from: `/services/${id}` } });
      return;
    }
    if (user.role !== "customer") {
      setError("Please log in with a customer account to book a service.");
      return;
    }
    if (!booking.date || !booking.time || !booking.address.trim()) {
      setError("Please choose a date, time and enter your address.");
      return;
    }

    const selectedService = provider.services.find(
      (s) => String(s.id) === serviceId
    );

    setError("");
    setSaving(true);

    try {
      await api("/api/bookings", {
        method: "POST",
        token,
        body: {
          providerId: provider.id,
          serviceId: Number(serviceId),
          ...booking,
        },
      });

      // Go to the confirmation page and pass the booking details along
      navigate("/booking-confirmed", {
        state: {
          service: selectedService.name,
          provider: provider.name,
          when: `${formatDate(booking.date)}, ${formatTime(booking.time)}`,
          address: booking.address,
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="wrap">
        <p className="m">Loading...</p>
      </div>
    );
  }

  // If the id in the address does not match any approved provider
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

  const hasServices = provider.services.length > 0;
  const selected = provider.services.find((s) => String(s.id) === serviceId);

  return (
    <div className="wrap">
      <Link className="back-link" to="/services">
        ← Back to services
      </Link>

      <div className="detail-layout">
        {/* Left side: provider information */}
        <div className="detail-main">
          <ServiceIllustration
            banner
            id={provider.illustration}
            service={provider.service}
          >
            <ProviderAvatar src={provider.photo} name={provider.name} size={120} />
            <div className="banner-panel">
              <h1 style={{ fontSize: 26 }}>{provider.service}</h1>
              <p className="m" style={{ marginTop: 4 }}>
                by {provider.name} · {provider.location} · ★{" "}
                {provider.rating ?? "New"}
              </p>
            </div>
          </ServiceIllustration>

          <h2 style={{ fontSize: 20, marginTop: 28 }}>About this service</h2>
          <p style={{ marginTop: 8, lineHeight: 1.6 }}>
            {provider.description || "This provider has not added a description yet."}
          </p>

          <h2 style={{ fontSize: 20, marginTop: 28 }}>Services offered</h2>
          {hasServices ? (
            provider.services.map((s) => (
              <div className="card review-card" key={s.id}>
                <div
                  style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
                >
                  <b>{s.name}</b>
                  <b>₹{s.price}</b>
                </div>
                {s.description && (
                  <p className="m" style={{ marginTop: 6 }}>
                    {s.description}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="m" style={{ marginTop: 14 }}>
              This provider has not added any services yet.
            </p>
          )}

          <h2 style={{ fontSize: 20, marginTop: 32 }}>Customer reviews</h2>

          {provider.reviews.length > 0 ? (
            provider.reviews.map((r) => (
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
            {selected ? `Price: ₹${selected.price}` : "No prices listed yet"}
          </p>

          {error && (
            <p className="b x" style={{ marginTop: 14 }}>
              {error}
            </p>
          )}

          {hasServices && (
            <>
              <label htmlFor="service">Service</label>
              <select
                id="service"
                className="in"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
              >
                {provider.services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} · ₹{s.price}
                  </option>
                ))}
              </select>
            </>
          )}

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
            disabled={!hasServices || saving}
          >
            {saving ? "Booking..." : "Confirm booking"}
          </button>

          {!user && (
            <p className="m" style={{ marginTop: 10, textAlign: "center" }}>
              You will be asked to log in first.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default ServiceDetail;