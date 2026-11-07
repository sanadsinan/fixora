import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { formatDate, formatTime } from "../utils/format";
import "./ProviderPages.css";

// The server uses lowercase words, and this page shows friendlier ones
const label = {
  pending: "New",
  confirmed: "Accepted",
  completed: "Completed",
  cancelled: "Cancelled",
};

const badgeClass = {
  pending: "b w",
  confirmed: "b ok",
  completed: "b ok",
  cancelled: "b x",
};

const tabs = ["New", "Accepted", "Completed", "Cancelled"];

function ProviderRequests() {
  const { token } = useAuth();

  const [requests, setRequests] = useState([]);
  const [tab, setTab] = useState("New");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load the bookings made with me
  useEffect(() => {
    api("/api/bookings/requests", { token })
      .then(setRequests)
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

  const visible = requests.filter((r) => label[r.status] === tab);

  const renderAction = (r) => {
    if (r.status === "pending") {
      return (
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
      );
    }
    if (r.status === "confirmed") {
      return (
        <button
          className="btn btn-sm"
          onClick={() => updateStatus(r.id, "completed")}
        >
          Mark completed
        </button>
      );
    }
    return "–";
  };

  return (
    <div>
      <div className="page-head">
        <h1 style={{ fontSize: 26 }}>Booking requests</h1>
      </div>

      <div className="tab-row">
        {tabs.map((name) => (
          <button
            key={name}
            className={tab === name ? "btn btn-sm" : "btn btn2 btn-sm"}
            onClick={() => setTab(name)}
          >
            {name}
          </button>
        ))}
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
              <th>Customer</th>
              <th>Service</th>
              <th>Date &amp; time</th>
              <th>Address</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", color: "#475569" }}>
                  Loading requests...
                </td>
              </tr>
            ) : visible.length > 0 ? (
              visible.map((r) => (
                <tr key={r.id}>
                  <td>{r.customer}</td>
                  <td>{r.service}</td>
                  <td>
                    {formatDate(r.date)}, {formatTime(r.time)}
                  </td>
                  <td>{r.address}</td>
                  <td>
                    <span className={badgeClass[r.status]}>{label[r.status]}</span>
                  </td>
                  <td>{renderAction(r)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", color: "#475569" }}>
                  No requests in this tab.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProviderRequests;