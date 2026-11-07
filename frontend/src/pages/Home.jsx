import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import ServiceIllustration from "../components/ServiceIllustration";
import heroImg from "../assets/hero.svg";
import "./Home.css";
import useCategories from "../hooks/useCategories";

const categories = [
  "Plumbing",
  "Electrical",
  "Cleaning",
  "Carpentry",
  "AC Repair",
  "Painting",
];

const steps = [
  { title: "1. Search", text: "Pick a service and your area." },
  { title: "2. Book", text: "Choose a provider, date and time." },
  { title: "3. Review", text: "Rate the job once it is done." },
];

function Home() {
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const categories = useCategories();

  // Load the top-rated providers from the server (the server sends them sorted)
  useEffect(() => {
    api("/api/providers")
      .then((data) => setProviders(data.slice(0, 6)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = () => {
    // Go to the services page with the search words in the address
    navigate(
      `/services?service=${encodeURIComponent(service)}&location=${encodeURIComponent(location)}`
    );
  };

  return (
    <div>
      {/* Hero */}
      <div className="hero">
        <div className="wrap hero-inner">
          <div className="hero-text">
            <span className="b hero-badge">Verified local providers</span>
            <h1>Trusted local services, booked in minutes</h1>
            <p className="hero-sub">
              Find plumbers, electricians, cleaners and more near you.
            </p>

            <div className="card search-bar">
              <input
                className="in"
                placeholder="What service do you need?"
                aria-label="Service"
                value={service}
                onChange={(e) => setService(e.target.value)}
              />
              <input
                className="in"
                placeholder="Your location"
                aria-label="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <button className="btn" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>

          <img
            className="hero-img"
            src={heroImg}
            alt="House with tools and a booking confirmation"
          />
        </div>
      </div>

      <div className="wrap">
        {/* Categories */}
        <h2>Popular categories</h2>
        <div className="grid" style={{ marginTop: 20 }}>
          {categories.map((name) => (
            <Link
              className="card category-card"
              key={name}
              to={`/services?category=${encodeURIComponent(name)}`}
            >
              <h3>{name}</h3>
            </Link>
          ))}
        </div>

        {/* How it works */}
        <h2 className="section-title">How it works</h2>
        <div className="grid" style={{ marginTop: 20 }}>
          {steps.map((step) => (
            <div className="card" key={step.title}>
              <h3>{step.title}</h3>
              <p className="m" style={{ marginTop: 6 }}>
                {step.text}
              </p>
            </div>
          ))}
        </div>

        {/* Top-rated providers */}
        <h2 className="section-title">Top-rated providers</h2>

        {loading ? (
          <p className="m" style={{ marginTop: 16 }}>
            Loading providers...
          </p>
        ) : providers.length === 0 ? (
          <p className="m" style={{ marginTop: 16 }}>
            No providers are available yet. Please check back soon.
          </p>
        ) : (
          <div className="provider-row">
            {providers.map((p) => (
              <div className="card provider-card" key={p.id}>
                <ServiceIllustration
                  id={p.illustration}
                  service={p.service}
                  height={130}
                />
                <h3>{p.name}</h3>
                <p className="m">
                  {p.service} · {p.location}
                </p>
                <p className="m">
                  ★ {p.rating ?? "New"} ·{" "}
                  {p.price !== null ? `from ₹${p.price}` : "No services yet"}
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
        )}
      </div>
    </div>
  );
}

export default Home;