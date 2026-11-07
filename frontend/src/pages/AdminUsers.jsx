import { useState } from "react";
import useAdminUsers from "../hooks/useAdminUsers";
import UserActions, { userBadge, userLabel } from "../components/UserActions";
import "./AdminPages.css";

const tabs = ["All", "Customers", "Providers", "Pending approval"];

function AdminUsers() {
  const { users, loading, error, approve, reject, block, unblock } = useAdminUsers();
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");

  const visible = users.filter((u) => {
    const matchesTab =
      tab === "All" ||
      (tab === "Customers" && u.type === "Customer") ||
      (tab === "Providers" && u.type === "Provider") ||
      (tab === "Pending approval" && u.status === "pending");

    const text = search.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(text) || u.email.toLowerCase().includes(text);

    return matchesTab && matchesSearch;
  });

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

      {error && (
        <p className="b x" style={{ marginTop: 16 }}>
          {error}
        </p>
      )}

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
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", color: "#475569" }}>
                  Loading users...
                </td>
              </tr>
            ) : visible.length > 0 ? (
              visible.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.type}</td>
                  <td>
                    <span className={userBadge[u.status]}>{userLabel[u.status]}</span>
                  </td>
                  <td>
                    <UserActions
                      user={u}
                      approve={approve}
                      reject={reject}
                      block={block}
                      unblock={unblock}
                    />
                  </td>
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