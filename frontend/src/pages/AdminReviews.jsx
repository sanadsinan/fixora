import { useState } from "react";
import { providers, reviews as initialReviews } from "../data/providers";
import "./AdminPages.css";

// Finds the provider's name from the id stored in each review
const providerName = (id) => {
  const provider = providers.find((p) => p.id === id);
  return provider ? provider.name : "Unknown";
};

function AdminReviews() {
  const [reviews, setReviews] = useState(initialReviews);

  const handleDelete = (id) => {
    if (window.confirm("Delete this review?")) {
      setReviews(reviews.filter((r) => r.id !== id));
    }
  };

  return (
    <div>
      <div className="page-head">
        <h1 style={{ fontSize: 26 }}>Reviews</h1>
      </div>

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
            {reviews.length > 0 ? (
              reviews.map((r) => (
                <tr key={r.id}>
                  <td>{r.customer}</td>
                  <td>{providerName(r.providerId)}</td>
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