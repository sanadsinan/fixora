import { useState, useRef } from "react";
import { categories } from "../data/providers";
import { initialServices } from "../data/services";
import "./ProviderPages.css";

const emptyForm = {
  name: "",
  category: categories[0],
  price: "",
  description: "",
};

function ProviderServices() {
  const [services, setServices] = useState(initialServices);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const formRef = useRef(null);

  const scrollToForm = () => {
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddClick = () => {
    setEditingId(null);
    setForm(emptyForm);
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

  const handleDelete = (id) => {
    if (!window.confirm("Delete this service?")) return;
    setServices(services.filter((s) => s.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
    }
  };

  const toggleStatus = (id) => {
    setServices(
      services.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "Active" ? "Hidden" : "Active" }
          : s
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.price) {
      setError("Please enter a service name and price.");
      return;
    }
    if (isNaN(Number(form.price)) || Number(form.price) <= 0) {
      setError("Price must be a number greater than 0.");
      return;
    }

    const data = { ...form, price: Number(form.price) };

    if (editingId) {
      // Editing: replace the fields of that one service
      setServices(
        services.map((s) => (s.id === editingId ? { ...s, ...data } : s))
      );
    } else {
      // Adding: Date.now() is a temporary id. The database gives real ids later.
      setServices([...services, { id: Date.now(), status: "Active", ...data }]);
    }

    console.log("Service saved:", data);
    // Later we will send this to the backend

    setError("");
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <div>
      <div className="page-head">
        <h1 style={{ fontSize: 26 }}>My services</h1>
        <button className="btn btn-sm" onClick={handleAddClick}>
          + Add service
        </button>
      </div>

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
                    <span className={s.status === "Active" ? "b ok" : "b w"}>
                      {s.status}
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
                        onClick={() => toggleStatus(s.id)}
                      >
                        {s.status === "Active" ? "Hide" : "Show"}
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

        {error && (
          <p className="b x" style={{ marginTop: 14 }}>
            {error}
          </p>
        )}

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
        >
          {editingId ? "Update service" : "Save service"}
        </button>
      </form>
    </div>
  );
}

export default ProviderServices;