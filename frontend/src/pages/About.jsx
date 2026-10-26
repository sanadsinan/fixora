import { Link } from "react-router-dom";
import { providers, categories } from "../data/providers";
import "./About.css";

// Numbers come from our data where possible. The last two are dummy values.
const stats = [
  { value: providers.length, label: "Verified providers" },
  { value: categories.length, label: "Services offered" },
  { value: "120+", label: "Completed bookings" },
  { value: "200+", label: "Happy customers" },
];

const reasons = [
  {
    title: "Verified providers",
    text: "Every provider is reviewed by an admin before going live.",
  },
  {
    title: "Easy booking",
    text: "Pick a service, choose a date and time, and confirm.",
  },
  {
    title: "Honest reviews",
    text: "Customers rate each completed job to help others decide.",
  },
];

// Change these to your own names and roles
const team = [
  { name: "Dona Joy"},
  { name: "Sanadsinan M" },
];

function About() {
  return (
    <div>
      {/* Hero */}
      <div className="about-hero">
        <div className="wrap about-hero-inner">
          <span className="about-badge">About us</span>
          <h1>Making local services simple and trustworthy</h1>
          <p>
            Fixora connects people with reliable local professionals and makes
            booking as easy as a few taps.
          </p>
        </div>
      </div>

      <div className="wrap">
        {/* Our story */}
        <div className="story">
          <div className="ph story-img">Story image</div>
          <div className="story-text">
            <h2 style={{ fontSize: 30 }}>Our story</h2>
            <p className="m">
              Finding a good plumber, electrician or cleaner often means asking
              around for phone numbers and hoping for the best. Fixora brings
              trusted local providers and simple online booking into one place,
              so customers save time and providers reach more people.
            </p>
          </div>
        </div>

        {/* Mission and vision */}
        <div
          className="grid"
          style={{
            marginTop: 40,
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          }}
        >
          <div className="card about-card">
            <h3>Our mission</h3>
            <p className="m">
              To make hiring local help quick, transparent and stress-free for
              everyone.
            </p>
          </div>
          <div className="card about-card">
            <h3>Our vision</h3>
            <p className="m">
              A community where every skilled professional can find work and
              every home can find help.
            </p>
          </div>
        </div>

        {/* Why choose Fixora */}
        <h2 className="about-section-title">Why choose Fixora</h2>
        <div className="grid" style={{ marginTop: 24 }}>
          {reasons.map((r) => (
            <div className="card about-card" key={r.title}>
              <div className="icon-circle">✓</div>
              <h3 style={{ marginTop: 14 }}>{r.title}</h3>
              <p className="m">{r.text}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="card stats-card">
          {stats.map((s) => (
            <div className="stat-item" key={s.label}>
              <h2>{s.value}</h2>
              <p className="m">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Team */}
        <h2 className="about-section-title">Meet the team</h2>
        <div className="grid team-grid">
          {team.map((member) => (
            <div className="card team-card" key={member.name}>
              <div className="ph avatar">Photo</div>
              <h3>{member.name}</h3>
              <p className="m" style={{ marginTop: 4 }}>
                {member.role}
              </p>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="cta">
          <h2>Ready to get started?</h2>
          <p>Book a service today or start offering your own.</p>
          <div className="cta-buttons">
            <Link className="btn btn2" to="/services">
              Find a service
            </Link>
            <Link className="btn btn-ghost" to="/register">
              Become a provider
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;