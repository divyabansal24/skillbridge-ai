import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      {/* Background glow effects */}
      <div className="hero-glow"></div>
      <div className="hero-glow2"></div>

      <div className="hero-badge">
        🚀 Next-Gen AI Career Prep
      </div>

      <h1 className="hero-h1">
        Get <span className="hero-grad">Placement-Ready</span> <br />
        in 30 Days
      </h1>

      <p className="hero-sub">
        Analyze your resume, identify skill gaps, practice AI-driven mock interviews, and connect with industry mentors.
      </p>

      <div className="hero-btns">
        <button onClick={() => navigate("/register")} className="btn-accent">
          Get Started Free
        </button>
        <button onClick={() => navigate("/login")} className="btn-secondary" style={{ padding: "0.75rem 2rem" }}>
          Sign In
        </button>
      </div>

      <div className="hero-stats">
        <div className="hero-stat">
          <span>95%</span>
          <p>ATS Match Rate</p>
        </div>
        <div className="hero-stat-div"></div>
        <div className="hero-stat">
          <span>10k+</span>
          <p>Mock Interviews</p>
        </div>
        <div className="hero-stat-div"></div>
        <div className="hero-stat">
          <span>4.9/5</span>
          <p>Mentor Rating</p>
        </div>
      </div>
    </section>
  );
}

export default Hero;