import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import useAdminUsers from "../hooks/useAdminUsers";
import UserActions, { userBadge, userLabel } from "../components/UserActions";

function AdminDashboard() {
  const { token } = useAuth();
  const { users, loading, error, approve, reject, block, unblock } = useAdminUsers();
  const [bookingCount, setBookingCount] = useState(0);

  useEffect(() => {
    api("/api/admin/stats", { token })
      .then((s) => setBookingCount(s.bookings))
      .catch(() => {});
  }, [token]);

  // Numbers worked out from the list, so they change when you approve or block
  const providers = users.filter((u) => u.type === "Provider");
  const approvedCount = providers.filter((u) => u.status === "approved").length;
  const pendingCount = providers.filter((u) => u.status === "pending").length;

  // Pending applications first
  const sorted = [...providers].sort(
    (a, b) => (b.status === "pending") - (a.status === "pending")
  );

  if (loading) return <p className="m">Loading the dashboard...</p>;

  return (
    <div>
      <h1 style={{ fontSize: 26 }}>Admin dashboard</h1>

      {error && (
        <p className="b x" style={{ marginTop: 16 }}>
          {error}
        </p>
      )}

      {/* Summary cards */}
      <div className="grid" style={{ marginTop: 20 }}>
        <div className="card stat">
          <p className="m">Total users</p>
          <h2>{users.length}</h2>
        </div>
        <div className="card stat">
          <p className="m">Approved providers</p>
          <h2>{approvedCount}</h2>
        </div>
        <div className="card stat">
          <p className="m">Waiting for approval</p>
          <h2>{pendingCount}</h2>
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
            {sorted.length > 0 ? (
              sorted.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.category}</td>
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
                <td colSpan="4" style={{ textAlign: "center", color: "#475569" }}>
                  No provider applications yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;