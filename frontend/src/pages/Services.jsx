import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { providers, categories } from "../data/Providers";
import "./Services.css";

function Services() {
  // Reads words sent from the Home page search bar (?service=...&location=...)
  const [params] = useSearchParams();

  const [searchText, setSearchText] = useState(params.get("service") || "");
  const [query, setQuery] = useState(params.get("service") || "");
  const categoryFromAddress = params.get("category");
  const [selectedCategories, setSelectedCategories] = useState(categoryFromAddress ? [categoryFromAddress] : []);
  const [location, setLocation] = useState(params.get("location") || "");
  const [minRating, setMinRating] = useState(0);

  const toggleCategory = (name) => {
    if (selectedCategories.includes(name)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== name));
    } else {
      setSelectedCategories([...selectedCategories, name]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(searchText);
  };

  const clearFilters = () => {
    setSearchText("");
    setQuery("");
    setSelectedCategories([]);
    setLocation("");
    setMinRating(0);
  };

  // Keep only the providers that pass every filter
  const filtered = providers.filter((p) => {
    const text = query.toLowerCase();
    const matchesQuery =
      p.name.toLowerCase().includes(text) ||
      p.service.toLowerCase().includes(text);

    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(p.service);

    const matchesLocation = p.location
      .toLowerCase()
      .includes(location.toLowerCase());

    const matchesRating = p.rating >= minRating;

    return matchesQuery && matchesCategory && matchesLocation && matchesRating;
  });

  return (
    <div className="wrap">
      <h1 style={{ fontSize: 28 }}>Find a service</h1>

      {/* Search bar */}
      <form
        onSubmit={handleSearch}
        style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}
      >
        <input
          className="in"
          style={{ maxWidth: 420, margin: 0 }}
          placeholder="Search services or providers"
          aria-label="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button type="submit" className="btn">
          Search
        </button>
      </form>

      <div className="services-layout">
        {/* Filters */}
        <div className="card filters">
          <h3>Filters</h3>

          <label>Category</label>
          {categories.map((name) => (
            <label className="check" key={name}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(name)}
                onChange={() => toggleCategory(name)}
              />
              {name}
            </label>
          ))}

          <label htmlFor="location">Location</label>
          <input
            id="location"
            className="in"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <label htmlFor="rating">Minimum rating</label>
          <select
            id="rating"
            className="in"
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
          >
            <option value={0}>Any</option>
            <option value={3}>3+</option>
            <option value={4}>4+</option>
          </select>

          <button
            type="button"
            className="btn btn2"
            style={{ display: "block", width: "100%", marginTop: 20 }}
            onClick={clearFilters}
          >
            Clear filters
          </button>
        </div>

        {/* Results */}
        {filtered.length > 0 ? (
          <div className="grid service-results">
            {filtered.map((p) => (
              <div className="card service-card" key={p.id}>
                <div className="ph" style={{ height: 130 }}>
                  Service photo
                </div>
                <h3>{p.name}</h3>
                <p className="m">
                  {p.service} · {p.location}
                </p>
                <p className="m">
                  ★ {p.rating} · from ₹{p.price}
                </p>
                <Link
                  className="btn"
                  to={`/services/${p.id}`}
                  style={{ marginTop: 14, display: "block", textAlign: "center" }}
                >
                  View &amp; Book
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="m empty-msg">
            No providers found. Try changing your filters.
          </p>
        )}
      </div>
    </div>
  );
}

export default Services;