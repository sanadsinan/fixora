import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export default function useAdminUsers() {
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/admin/users", { token })
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  // Sends one change to the server and puts the updated row in the list
  const send = async (id, action, body) => {
    try {
      const updated = await api(`/api/admin/users/${id}/${action}`, {
        method: "PATCH",
        token,
        body,
      });
      setUsers((list) => list.map((u) => (u.id === id ? updated : u)));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    users,
    loading,
    error,
    approve: (id) => send(id, "approval", { status: "approved" }),
    reject: (id) => send(id, "approval", { status: "rejected" }),
    block: (id) => {
      if (window.confirm("Block this account?")) {
        send(id, "blocked", { blocked: true });
      }
    },
    unblock: (id) => send(id, "blocked", { blocked: false }),
  };
}