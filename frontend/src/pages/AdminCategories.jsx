import { useState } from "react";
import { providers } from "../data/providers";
import { initialCategories } from "../data/adminCategories";
import "./AdminPages.css";

const emptyForm = { name: "", description: "" };

function AdminCategories() {
  const [categories, setCategories] = useState(initialCategories);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  // How many providers offer this category (worked out from the providers list)
  const providerCount = (name) =>
    providers.filter((p) => p.service === name).length;

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

  const handleDelete = (c) => {
    const count = providerCount(c.name);
    const message =
      count > 0
        ? `${count} provider(s) offer ${c.name}. Delete it anyway?`
        : `Delete the ${c.name} category?`;

    if (!window.confirm(message)) return;

    setCategories(categories.filter((x) => x.id !== c.id));
    if (editingId === c.id) handleCancelEdit();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = form.name.trim();
    if (!name) {
      setError("Please enter a category name.");
      return;
    }

    const duplicate = categories.some(
      (c) => c.name.toLowerCase() === name.toLowerCase() && c.id !== editingId
    );
    if (duplicate) {
      setError("This category already exists.");
      return;
    }

    if (editingId) {
      setCategories(
        categories.map((c) =>
          c.id === editingId ? { ...c, name, description: form.description } : c
        )
      );
    } else {
      // Date.now() is a temporary id. The database gives real ids later.
      setCategories([
        ...categories,
        { id: Date.now(), name, description: form.description },
      ]);
    }

    setError("");
    setEditingId(null);
    setForm(emptyForm);
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
              {categories.length > 0 ? (
                categories.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{providerCount(c.name)}</td>
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
        >
          {editingId ? "Update category" : "Add category"}
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