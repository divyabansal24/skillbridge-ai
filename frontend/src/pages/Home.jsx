import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();
  const [selectedFeature, setSelectedFeature] = useState(null);

  const FEATURE_DETAILS = {
    ats: {
      title: "Resume ATS Analyzer",
      description: "Compare your resume against target job descriptions and instantly calculate your compatibility score. Our system scans for 16 target skills, computes an overall compatibility percentage, and highlights matching keywords.",
      actionText: "Open Resume Analyzer",
      tab: "resume"
    },
    interview: {
      title: "AI Mock Interview",
      description: "Simulate a real-world placement interview. Select a role (e.g. Frontend, Backend, Full Stack), generate 5 customized questions, and type your responses. Receive detailed scoring, feedback, strengths, and area-of-improvement breakdown for each answer.",
      actionText: "Start Mock Interview",
      tab: "interview"
    },
    gap: {
      title: "Skill Gap Analysis",
      description: "Identify matching and missing qualifications automatically when you parse your resume. The platform calculates your target role's missing skills and provides resources to bridge those gaps.",
      actionText: "Check Your Gaps",
      tab: "resume"
    },
    mentor: {
      title: "Mentor Match",
      description: "Browse a list of industry professional mentors from leading companies like Flipkart, TCS, and Infosys. Instantly request connections with mentors specializing in React, DevOps, System Design, or Machine Learning.",
      actionText: "Find Mentors",
      tab: "mentors"
    },
    resources: {
      title: "Learning Resources",
      description: "Access learning guides, tutorials, and documentation hand-picked for your skill gaps. Includes official links for React, Docker, TypeScript, Redux, Python, LeetCode, and roadmaps.",
      actionText: "Explore Resources",
      tab: "resources"
    },
    progress: {
      title: "Progress Tracking",
      description: "Keep track of your career preparation readiness score through dynamic progress tracking. Track resume uploads, skills assessment, mock interviews, and mentor connections.",
      actionText: "View Progress Dashboard",
      tab: "dashboard"
    }
  };

  const handleActionClick = (tab) => {
    const isLoggedIn = !!localStorage.getItem("token");
    if (isLoggedIn) {
      navigate(`/dashboard?tab=${tab}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="home">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="features-section">
        <div className="feat-label">Features</div>
        <h2 className="feat-heading">Everything You Need to Get Hired</h2>

        <div className="features-grid">
          {/* Card 1: ATS Analyzer */}
          <div className="feat-card" onClick={() => setSelectedFeature(FEATURE_DETAILS.ats)}>
            <div className="feat-icon" style={{ color: "var(--accent2)" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <h3>ATS Analyzer</h3>
            <p>Compare your resume against target job descriptions and instantly calculate your compatibility score.</p>
          </div>

          {/* Card 2: AI Interview */}
          <div className="feat-card" onClick={() => setSelectedFeature(FEATURE_DETAILS.interview)}>
            <div className="feat-icon" style={{ color: "var(--accent1)" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <h3>AI Interview</h3>
            <p>Practice with realistic role-specific questions and receive real-time speech and content reviews.</p>
          </div>

          {/* Card 3: Skill Gap */}
          <div className="feat-card" onClick={() => setSelectedFeature(FEATURE_DETAILS.gap)}>
            <div className="feat-icon" style={{ color: "var(--accent2)" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
              </svg>
            </div>
            <h3>Skill Gap</h3>
            <p>Analyze target requirements to extract missing technical and soft skills required for the role.</p>
          </div>

          {/* Card 4: Mentor Match */}
          <div className="feat-card" onClick={() => setSelectedFeature(FEATURE_DETAILS.mentor)}>
            <div className="feat-icon" style={{ color: "var(--accent1)" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3>Mentor Match</h3>
            <p>Get personalized recommendations and connect with industry mentors who match your career path.</p>
          </div>

          {/* Card 5: Resources */}
          <div className="feat-card" onClick={() => setSelectedFeature(FEATURE_DETAILS.resources)}>
            <div className="feat-icon" style={{ color: "var(--accent2)" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <h3>Resources</h3>
            <p>Access hand-picked learning tutorials, documentation, and videos to cover missing skill areas.</p>
          </div>

          {/* Card 6: Progress Tracking */}
          <div className="feat-card" onClick={() => setSelectedFeature(FEATURE_DETAILS.progress)}>
            <div className="feat-icon" style={{ color: "var(--accent1)" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <h3>Progress Tracking</h3>
            <p>Track your preparation milestones, module completions, and overall career readiness rating.</p>
          </div>
        </div>
      </section>

      {/* CTA Box Section */}
      <section className="cta-section">
        <div className="cta-box">
          <h2>Start Your Journey Today</h2>
          <p>Accelerate your career preparation. Optimize your profile, clear mock interviews, and land your ideal job role.</p>
          <button onClick={() => navigate("/register")} className="btn-accent" style={{ marginTop: "1.5rem" }}>
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div>© 2026 SkillBridge AI. All rights reserved.</div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <a href="/privacy" style={{ color: "var(--muted)", textDecoration: "none" }}>Privacy Policy</a>
          <a href="/terms" style={{ color: "var(--muted)", textDecoration: "none" }}>Terms of Service</a>
        </div>
      </footer>

      {/* Modal Popup */}
      {selectedFeature && (
        <div className="modal-overlay" onClick={() => setSelectedFeature(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{selectedFeature.title}</h3>
              <button className="modal-close-btn" onClick={() => setSelectedFeature(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <p>{selectedFeature.description}</p>
            </div>
            <div className="modal-footer">
              <button className="modal-btn modal-btn-secondary" onClick={() => setSelectedFeature(null)}>
                Close
              </button>
              <button 
                className="modal-btn modal-btn-primary" 
                onClick={() => {
                  handleActionClick(selectedFeature.tab);
                  setSelectedFeature(null);
                }}
              >
                {selectedFeature.actionText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;