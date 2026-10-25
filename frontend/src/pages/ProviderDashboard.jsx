import { useState } from "react";
import { initialRequests } from "../data/requests";

function ProviderDashboard() {
  const [requests, setRequests] = useState(initialRequests);

  // Change the status of one request
  const updateStatus = (id, newStatus) => {
    setRequests(
      requests.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  // The numbers in the cards are worked out from the list
  const newRequests = requests.filter((r) => r.status === "Pending").length;
  const completedJobs = requests.filter((r) => r.status === "Completed").length;
  const averageRating = 4.8; // dummy value for now

  // The table only shows requests that still need action
  const openRequests = requests.filter(
    (r) => r.status === "Pending" || r.status === "Confirmed"
  );

  return (
    <div>
      <h1 style={{ fontSize: 26 }}>Provider dashboard</h1>

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
          <h2>★ {averageRating}</h2>
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
                  <td>{r.when}</td>
                  <td>
                    {r.status === "Pending" ? (
                      <div className="action-group">
                        <button
                          className="btn btn-sm"
                          onClick={() => updateStatus(r.id, "Confirmed")}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn2 btn-sm"
                          onClick={() => updateStatus(r.id, "Cancelled")}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn btn-sm"
                        onClick={() => updateStatus(r.id, "Completed")}
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