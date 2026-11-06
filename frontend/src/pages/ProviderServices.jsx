import { useEffect, useRef, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import "./ProviderPages.css";

const emptyForm = { name: "", category: "", price: "", description: "" };

function ProviderServices() {
  const { user, token } = useAuth();

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef(null);

  // Load my services and the category list from the server
  useEffect(() => {
    Promise.all([
      api("/api/services/mine", { token }),
      api("/api/categories"),
    ])
      .then(([serviceData, categoryData]) => {
        const names = categoryData.map((c) => c.name);
        setServices(serviceData);
        setCategories(names);
        setForm((f) => ({ ...f, category: names[0] || "" }));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const scrollToForm = () => {
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm, category: categories[0] || "" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddClick = () => {
    resetForm();
    setError("");
    scrollToForm();
  };

  const handleEdit = (s) => {
    setEditingId(s.id);
    setForm({
      name: s.name,
      category: s.category,
      price: String(s.price),
      description: s.description,
    });
    setError("");
    scrollToForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;

    try {
      await api(`/api/services/${id}`, { method: "DELETE", token });
      setServices(services.filter((s) => s.id !== id));
      if (editingId === id) resetForm();
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleStatus = async (s) => {
    try {
      const updated = await api(`/api/services/${s.id}/status`, {
        method: "PATCH",
        token,
        body: { status: s.status === "active" ? "hidden" : "active" },
      });
      setServices(services.map((x) => (x.id === s.id ? updated : x)));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.price) {
      setError("Please enter a service name and price.");
      return;
    }
    if (isNaN(Number(form.price)) || Number(form.price) <= 0) {
      setError("Price must be a number greater than 0.");
      return;
    }

    setError("");
    setSaving(true);

    try {
      if (editingId) {
        const updated = await api(`/api/services/${editingId}`, {
          method: "PUT",
          token,
          body: form,
        });
        setServices(services.map((s) => (s.id === editingId ? updated : s)));
      } else {
        const created = await api("/api/services", {
          method: "POST",
          token,
          body: form,
        });
        setServices([...services, created]);
      }
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="m">Loading your services...</p>;

  return (
    <div>
      <div className="page-head">
        <h1 style={{ fontSize: 26 }}>My services</h1>
        <button className="btn btn-sm" onClick={handleAddClick}>
          + Add service
        </button>
      </div>

      {user.approvalStatus !== "approved" && (
        <p className="b w" style={{ marginTop: 16 }}>
          Your services become visible to customers after an admin approves your
          provider profile.
        </p>
      )}

      {error && (
        <p className="b x" style={{ marginTop: 16 }}>
          {error}
        </p>
      )}

      <div className="card tw" style={{ marginTop: 20 }}>
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {services.length > 0 ? (
              services.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.category}</td>
                  <td>₹{s.price}</td>
                  <td>
                    <span className={s.status === "active" ? "b ok" : "b w"}>
                      {s.status === "active" ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td>
                    <div className="action-group">
                      <button
                        className="btn btn2 btn-sm"
                        onClick={() => handleEdit(s)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn2 btn-sm"
                        onClick={() => toggleStatus(s)}
                      >
                        {s.status === "active" ? "Hide" : "Show"}
                      </button>
                      <button
                        className="btn btn2 btn-sm"
                        onClick={() => handleDelete(s.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", color: "#475569" }}>
                  No services yet. Add your first one below.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <form className="card service-form" ref={formRef} onSubmit={handleSubmit}>
        <h2 style={{ fontSize: 20 }}>
          {editingId ? "Edit service" : "Add a new service"}
        </h2>

        <label htmlFor="name">Service name</label>
        <input
          id="name"
          name="name"
          className="in"
          value={form.name}
          onChange={handleChange}
        />

        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          className="in"
          value={form.category}
          onChange={handleChange}
        >
          {categories.map((name) => (
            <option key={name}>{name}</option>
          ))}
        </select>

        <label htmlFor="price">Price (₹)</label>
        <input
          id="price"
          name="price"
          className="in"
          value={form.price}
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
          {saving
            ? "Saving..."
            : editingId
            ? "Update service"
            : "Save service"}
        </button>

        {editingId && (
          <button
            type="button"
            className="btn btn2"
            style={{ display: "block", width: "100%", marginTop: 10 }}
            onClick={resetForm}
          >
            Cancel editing
          </button>
        )}
      </form>
    </div>
  );
}

export default ProviderServices;