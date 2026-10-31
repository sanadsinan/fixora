import { useState } from "react";
import { initialRequests } from "../data/requests";
import "./ProviderPages.css";

// The data uses one set of words, and this page shows friendlier ones
const label = {
  Pending: "New",
  Confirmed: "Accepted",
  Completed: "Completed",
  Cancelled: "Rejected",
};

const badgeClass = {
  New: "b w",
  Accepted: "b ok",
  Completed: "b ok",
  Rejected: "b x",
};

const tabs = ["New", "Accepted", "Completed", "Rejected"];

function ProviderRequests() {
  const [requests, setRequests] = useState(initialRequests);
  const [tab, setTab] = useState("New");

  const updateStatus = (id, newStatus) => {
    setRequests(
      requests.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const visible = requests.filter((r) => label[r.status] === tab);

  const renderAction = (r) => {
    if (r.status === "Pending") {
      return (
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
      );
    }
    if (r.status === "Confirmed") {
      return (
        <button
          className="btn btn-sm"
          onClick={() => updateStatus(r.id, "Completed")}
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
            {visible.length > 0 ? (
              visible.map((r) => (
                <tr key={r.id}>
                  <td>{r.customer}</td>
                  <td>{r.service}</td>
                  <td>{r.when}</td>
                  <td>{r.address}</td>
                  <td>
                    <span className={badgeClass[label[r.status]]}>
                      {label[r.status]}
                    </span>
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