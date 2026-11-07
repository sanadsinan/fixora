import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import "./AdminPages.css";

const emptyForm = { name: "", description: "" };

function AdminCategories() {
  const { token } = useAuth();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/admin/categories", { token })
      .then(setCategories)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (c) => {
    setEditingId(c.id);
    setForm({ name: c.name, description: c.description });
    setError("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Delete the ${c.name} category?`)) return;

    try {
      await api(`/api/admin/categories/${c.id}`, { method: "DELETE", token });
      setCategories(categories.filter((x) => x.id !== c.id));
      if (editingId === c.id) handleCancelEdit();
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("Please enter a category name.");
      return;
    }

    setError("");
    setSaving(true);

    try {
      if (editingId) {
        const updated = await api(`/api/admin/categories/${editingId}`, {
          method: "PUT",
          token,
          body: form,
        });
        setCategories(categories.map((c) => (c.id === editingId ? updated : c)));
      } else {
        const created = await api("/api/admin/categories", {
          method: "POST",
          token,
          body: form,
        });
        setCategories(
          [...categories, created].sort((a, b) => a.name.localeCompare(b.name))
        );
      }
      setEditingId(null);
      setForm(emptyForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="cat-layout">
      <div className="cat-main">
        <div className="page-head">
          <h1 style={{ fontSize: 26 }}>Categories</h1>
        </div>

        <div className="card tw" style={{ marginTop: 20 }}>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Providers</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", color: "#475569" }}>
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length > 0 ? (
                categories.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.providerCount}</td>
                    <td>
                      <div className="action-group">
                        <button
                          className="btn btn2 btn-sm"
                          onClick={() => handleEdit(c)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn2 btn-sm"
                          onClick={() => handleDelete(c)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", color: "#475569" }}>
                    No categories yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <form className="card cat-form" onSubmit={handleSubmit}>
        <h2 style={{ fontSize: 20 }}>
          {editingId ? "Edit category" : "Add category"}
        </h2>

        {error && (
          <p className="b x" style={{ marginTop: 14 }}>
            {error}
          </p>
        )}

        <label htmlFor="name">Category name</label>
        <input
          id="name"
          name="name"
          className="in"
          value={form.name}
          onChange={handleChange}
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows="2"
          className="in"
          value={form.description}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="btn"
          style={{ display: "block", width: "100%", marginTop: 20 }}
          disabled={saving}
        >
          {saving ? "Saving..." : editingId ? "Update category" : "Add category"}
        </button>

        {editingId && (
          <button
            type="button"
            className="btn btn2"
            style={{ display: "block", width: "100%", marginTop: 10 }}
            onClick={handleCancelEdit}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}

export default AdminCategories;