import { useState } from "react";
import {
  initialProviders,
  customerCount,
  bookingCount,
} from "../data/adminData";

// Which badge color to use for each status
const badgeClass = {
  Pending: "b w",
  Approved: "b ok",
  Blocked: "b x",
};

function AdminDashboard() {
  const [providers, setProviders] = useState(initialProviders);

  const updateStatus = (id, newStatus) => {
    setProviders(
      providers.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  const handleBlock = (id) => {
    if (window.confirm("Block this provider?")) {
      updateStatus(id, "Blocked");
    }
  };

  // The numbers in the cards are worked out from the list
  const totalUsers = customerCount + providers.length;
  const approvedProviders = providers.filter(
    (p) => p.status === "Approved"
  ).length;

  // Decides which buttons to show for each status
  const renderActions = (p) => {
    if (p.status === "Pending") {
      return (
        <div className="action-group">
          <button
            className="btn btn-sm"
            onClick={() => updateStatus(p.id, "Approved")}
          >
            Approve
          </button>
          <button className="btn btn2 btn-sm" onClick={() => handleBlock(p.id)}>
            Block
          </button>
        </div>
      );
    }

    if (p.status === "Approved") {
      return (
        <button className="btn btn2 btn-sm" onClick={() => handleBlock(p.id)}>
          Block
        </button>
      );
    }

    return (
      <button
        className="btn btn-sm"
        onClick={() => updateStatus(p.id, "Approved")}
      >
        Unblock
      </button>
    );
  };

  return (
    <div>
      <h1 style={{ fontSize: 26 }}>Admin dashboard</h1>

      {/* Summary cards */}
      <div className="grid" style={{ marginTop: 20 }}>
        <div className="card stat">
          <p className="m">Total users</p>
          <h2>{totalUsers}</h2>
        </div>
        <div className="card stat">
          <p className="m">Approved providers</p>
          <h2>{approvedProviders}</h2>
        </div>
        <div className="card stat">
          <p className="m">Bookings</p>
          <h2>{bookingCount}</h2>
        </div>
      </div>

      {/* Provider approvals */}
      <h2 style={{ fontSize: 20, marginTop: 32 }}>Provider approvals</h2>

      <div className="card tw" style={{ marginTop: 14 }}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Service</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.service}</td>
                <td>
                  <span className={badgeClass[p.status]}>{p.status}</span>
                </td>
                <td>{renderActions(p)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;