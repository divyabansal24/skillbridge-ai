import { Link, useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="home-nav">
      <div className="home-logo" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
        <div className="logo-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" opacity="0.3"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <span>SkillBridge <span className="logo-accent">AI</span></span>
      </div>

      <div className="home-nav-btns">
        <Link to="/login" className="btn-secondary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.9rem" }}>
          Login
        </Link>
        <Link to="/register" className="btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.9rem" }}>
          Get Started
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;