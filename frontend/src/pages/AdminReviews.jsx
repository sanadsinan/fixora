import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import "./AdminPages.css";

function AdminReviews() {
  const { token } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/admin/reviews", { token })
      .then(setReviews)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      await api(`/api/admin/reviews/${id}`, { method: "DELETE", token });
      setReviews(reviews.filter((r) => r.id !== id));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="page-head">
        <h1 style={{ fontSize: 26 }}>Reviews</h1>
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
              <th>Provider</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", color: "#475569" }}>
                  Loading reviews...
                </td>
              </tr>
            ) : reviews.length > 0 ? (
              reviews.map((r) => (
                <tr key={r.id}>
                  <td>{r.customer}</td>
                  <td>{r.provider}</td>
                  <td>★ {r.rating}</td>
                  <td>{r.comment}</td>
                  <td>
                    <button
                      className="btn btn2 btn-sm"
                      onClick={() => handleDelete(r.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", color: "#475569" }}>
                  No reviews.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminReviews;