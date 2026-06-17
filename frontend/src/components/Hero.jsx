import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            ✦ Next-Gen AI Career Prep
          </div>

          <h1 className="hero-h1">
            Get Placement-Ready <br />
            in 30 Days
          </h1>

          <p className="hero-sub">
            Analyze your resume, identify skill gaps, practice AI-driven mock interviews, and connect with industry mentors.
          </p>

          <div className="hero-btns">
            <button onClick={() => navigate("/register")} className="btn-accent">
              Get Started Free
            </button>
            <button onClick={() => navigate("/login")} className="btn-secondary">
              Sign In
            </button>
          </div>
        </div>

        <div className="hero-stats-panel">
          <div className="hero-stat-card">
            <div className="hero-stat-number">95%</div>
            <div className="hero-stat-label">ATS Match Rate</div>
            <p className="hero-stat-desc">Optimized formatting ensures parsing alignment.</p>
          </div>
          <div className="hero-stat-card">
            <div className="hero-stat-number">10k+</div>
            <div className="hero-stat-label">Mock Interviews</div>
            <p className="hero-stat-desc">Realistic questions powered by AI analytics.</p>
          </div>
          <div className="hero-stat-card">
            <div className="hero-stat-number">4.9/5</div>
            <div className="hero-stat-label">Mentor Rating</div>
            <p className="hero-stat-desc">Connect with elite guides from leading tech giants.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;