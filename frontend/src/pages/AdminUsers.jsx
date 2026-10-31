import { useState } from "react";
import { initialUsers } from "../data/adminUsers";
import "./AdminPages.css";

const badgeClass = {
  Active: "b ok",
  Approved: "b ok",
  Pending: "b w",
  Blocked: "b x",
  Rejected: "b x",
};

const tabs = ["All", "Customers", "Providers", "Pending approval"];

function AdminUsers() {
  const [users, setUsers] = useState(initialUsers);
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");

  const updateStatus = (id, newStatus) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: newStatus } : u)));
  };

  const handleBlock = (id) => {
    if (window.confirm("Block this account?")) {
      updateStatus(id, "Blocked");
    }
  };

  // Unblocking returns customers to Active and providers to Approved
  const handleUnblock = (u) => {
    updateStatus(u.id, u.role === "Customer" ? "Active" : "Approved");
  };

  const visible = users.filter((u) => {
    const matchesTab =
      tab === "All" ||
      (tab === "Customers" && u.role === "Customer") ||
      (tab === "Providers" && u.role === "Provider") ||
      (tab === "Pending approval" && u.status === "Pending");

    const text = search.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(text) ||
      u.email.toLowerCase().includes(text);

    return matchesTab && matchesSearch;
  });

  const renderActions = (u) => {
    if (u.status === "Pending") {
      return (
        <div className="action-group">
          <button
            className="btn btn-sm"
            onClick={() => updateStatus(u.id, "Approved")}
          >
            Approve
          </button>
          <button
            className="btn btn2 btn-sm"
            onClick={() => updateStatus(u.id, "Rejected")}
          >
            Reject
          </button>
        </div>
      );
    }
    if (u.status === "Active" || u.status === "Approved") {
      return (
        <button className="btn btn2 btn-sm" onClick={() => handleBlock(u.id)}>
          Block
        </button>
      );
    }
    if (u.status === "Blocked") {
      return (
        <button className="btn btn2 btn-sm" onClick={() => handleUnblock(u)}>
          Unblock
        </button>
      );
    }
    return "–";
  };

  return (
    <div>
      <div className="page-head">
        <h1 style={{ fontSize: 26 }}>Users &amp; providers</h1>
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

      <input
        className="in search-input"
        placeholder="Search by name or email"
        aria-label="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="card tw" style={{ marginTop: 20 }}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {visible.length > 0 ? (
              visible.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <span className={badgeClass[u.status]}>{u.status}</span>
                  </td>
                  <td>{renderActions(u)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", color: "#475569" }}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;