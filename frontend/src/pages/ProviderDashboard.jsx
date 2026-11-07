import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { formatDate, formatTime } from "../utils/format";

function ProviderDashboard() {
  const { token } = useAuth();

  const [requests, setRequests] = useState([]);
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load my bookings and my rating from the server
  useEffect(() => {
    Promise.all([
      api("/api/bookings/requests", { token }),
      api("/api/providers/me", { token }),
    ])
      .then(([bookingData, profile]) => {
        setRequests(bookingData);
        setRating(profile.rating);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const updateStatus = async (id, status) => {
    try {
      const updated = await api(`/api/bookings/${id}/status`, {
        method: "PATCH",
        token,
        body: { status },
      });
      setRequests(requests.map((r) => (r.id === id ? updated : r)));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  // The numbers in the cards are worked out from the list
  const newRequests = requests.filter((r) => r.status === "pending").length;
  const completedJobs = requests.filter((r) => r.status === "completed").length;

  // The table only shows requests that still need action
  const openRequests = requests.filter(
    (r) => r.status === "pending" || r.status === "confirmed"
  );

  if (loading) return <p className="m">Loading your dashboard...</p>;

  return (
    <div>
      <h1 style={{ fontSize: 26 }}>Provider dashboard</h1>

      {error && (
        <p className="b x" style={{ marginTop: 16 }}>
          {error}
        </p>
      )}

      {/* Summary cards */}
      <div className="grid" style={{ marginTop: 20 }}>
        <div className="card stat">
          <p className="m">New requests</p>
          <h2>{newRequests}</h2>
        </div>
        <div className="card stat">
          <p className="m">Completed jobs</p>
          <h2>{completedJobs}</h2>
        </div>
        <div className="card stat">
          <p className="m">Average rating</p>
          <h2>★ {rating ?? "–"}</h2>
        </div>
      </div>

      {/* Booking requests */}
      <h2 style={{ fontSize: 20, marginTop: 32 }}>Booking requests</h2>

      <div className="card tw" style={{ marginTop: 14 }}>
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Service</th>
              <th>Date &amp; time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {openRequests.length > 0 ? (
              openRequests.map((r) => (
                <tr key={r.id}>
                  <td>{r.customer}</td>
                  <td>{r.service}</td>
                  <td>
                    {formatDate(r.date)}, {formatTime(r.time)}
                  </td>
                  <td>
                    {r.status === "pending" ? (
                      <div className="action-group">
                        <button
                          className="btn btn-sm"
                          onClick={() => updateStatus(r.id, "confirmed")}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn2 btn-sm"
                          onClick={() => updateStatus(r.id, "cancelled")}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn btn-sm"
                        onClick={() => updateStatus(r.id, "completed")}
                      >
                        Mark completed
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", color: "#475569" }}>
                  No open requests.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProviderDashboard;