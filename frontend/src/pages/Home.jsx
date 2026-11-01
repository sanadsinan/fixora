import { useProviders } from "../context/ProvidersContext";
import ServiceIllustration from "../components/ServiceIllustration";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import heroImg from "../assets/hero.svg";

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
  const { providers } = useProviders();
  const topProviders = [...providers]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    // Go to the services page with the search words in the address
    navigate(`/services?service=${service}&location=${location}`);
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

          <img className="hero-img" src={heroImg} alt="House with tools and a booking confirmation" />
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
              <p className="m" style={{ marginTop: 6 }}>{step.text}</p>
            </div>
          ))}
        </div>

        {/* Top-rated providers */}
        <h2 className="section-title">Top-rated providers</h2>
        <div className="provider-row">
          {topProviders.map((p) => (
            <div className="card provider-card" key={p.id}>
              <ServiceIllustration id={p.illustration} service={p.service} height={130} />
              <h3>{p.name}</h3>
              <p className="m">{p.service} · {p.location}</p>
              <p className="m">★ {p.rating} · from ₹{p.price}</p>
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
      </div>
    </div>
  );
}

export default Home;