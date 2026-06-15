import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function PublicProfile() {
  const { username } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/profile/${username}`);
        const data = await response.json();

        if (response.ok) {
          setProfile(data);
        } else {
          if (response.status === 404) {
            setError("Profile not found");
          } else if (response.status === 403) {
            setError("This profile is private");
          } else {
            setError(data.message || "Failed to load profile");
          }
        }
      } catch (err) {
        console.error("Fetch profile error:", err);
        setError("Could not connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  // Initial Avatar Maker Helper
  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#08081A",
        color: "#FFFFFF",
        fontFamily: "var(--font-sans, sans-serif)"
      }}>
        {/* Loading Spinner */}
        <div style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          border: "4px solid rgba(108, 99, 255, 0.1)",
          borderTop: "4px solid #6C63FF",
          animation: "spin 1s linear infinite",
          marginBottom: "1rem"
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <span>Loading Portfolio...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#08081A",
        color: "#FFFFFF",
        padding: "2rem",
        textAlign: "center",
        fontFamily: "var(--font-sans, sans-serif)"
      }}>
        <div style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          border: "1px solid rgba(239, 68, 68, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#EF4444",
          marginBottom: "1.5rem"
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "0.5rem" }}>
          {error === "Profile not found" ? "404 - Profile Not Found" : "403 - Profile Private"}
        </h1>
        <p style={{ color: "#A0AEC0", maxWidth: "400px", lineHeight: "1.6", marginBottom: "2rem" }}>
          {error === "Profile not found" 
            ? "The user profile you are looking for does not exist or has been removed." 
            : "This user has configured their profile to be private."}
        </p>
        <button 
          onClick={() => navigate("/")}
          style={{
            background: "linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "0.75rem 2rem",
            fontSize: "0.95rem",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          Go Back Home
        </button>
      </div>
    );
  }

  // SVG progress variables
  const resultRadius = 45;
  const resultStrokeWidth = 8;
  const resultCircumference = 2 * Math.PI * resultRadius;
  const atsVal = profile.atsScore || 0;
  const resultStrokeDashoffset = resultCircumference * (1 - atsVal / 100);

  return (
    <div style={{
      backgroundColor: "#08081A",
      minHeight: "100vh",
      color: "#FFFFFF",
      padding: "2rem 1rem",
      boxSizing: "border-box"
    }}>
      {/* Styles & Dynamic Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@400;500;600;700&display=swap');
        
        .profile-wrapper {
          font-family: 'Outfit', sans-serif;
          max-width: 700px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .syne-font {
          font-family: 'Syne', sans-serif;
        }

        .profile-card {
          background-color: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 2rem;
          box-sizing: border-box;
        }

        .skills-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .skill-badge {
          background-color: rgba(108, 99, 255, 0.08);
          border: 1px solid rgba(108, 99, 255, 0.2);
          color: #A8A2FF;
          border-radius: 30px;
          padding: 0.4rem 1rem;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .stats-box {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          padding: 1.25rem 0.5rem;
          text-align: center;
        }

        .stats-num {
          font-size: 2.25rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 0.25rem;
        }

        .stats-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #A0AEC0;
          font-weight: 600;
        }
      `}</style>

      <div className="profile-wrapper">
        
        {/* HEADER HERO SECTION */}
        <div className="profile-card" style={{ padding: "0", overflow: "hidden", position: "relative" }}>
          
          {/* Gradient Banner Header */}
          <div style={{
            height: "150px",
            background: "linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)"
          }} />

          {/* Avatar and Details Block */}
          <div style={{
            padding: "2rem",
            paddingTop: "0",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative"
          }}>
            {/* Circle initials avatar overlay */}
            <div style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              backgroundColor: "#151532",
              border: "5px solid #08081A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2.25rem",
              fontWeight: "800",
              color: "#FFFFFF",
              marginTop: "-50px",
              boxShadow: "0 10px 20px rgba(0,0,0,0.3)"
            }} className="syne-font">
              {getInitials(profile.name)}
            </div>

            <h1 style={{ fontSize: "2rem", fontWeight: "800", margin: "1rem 0 0.25rem 0", color: "#FFFFFF" }} className="syne-font">
              {profile.name}
            </h1>
            
            <span style={{ fontSize: "0.95rem", color: "#A0AEC0", marginBottom: "1rem" }}>
              @{profile.username}
            </span>

            {/* Target Role Badge */}
            <span style={{
              background: "rgba(0, 212, 170, 0.08)",
              border: "1px solid rgba(0, 212, 170, 0.2)",
              color: "#00D4AA",
              fontSize: "0.8rem",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "1px",
              padding: "0.35rem 1.25rem",
              borderRadius: "30px",
              marginBottom: "1.5rem"
            }}>
              {profile.targetRole}
            </span>

            {profile.bio && (
              <p style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "0.95rem",
                lineHeight: "1.6",
                margin: "0",
                maxWidth: "550px",
                borderTop: "1px solid rgba(255,255,255,0.04)",
                paddingTop: "1.25rem",
                width: "100%"
              }}>
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        {/* STATS ROW */}
        <div style={{ display: "flex", gap: "1rem" }}>
          {/* Box 1: ATS Score */}
          <div className="stats-box">
            <span className="stats-num" style={{ color: "#00D4AA" }}>
              {profile.atsScore > 0 ? `${profile.atsScore}%` : "0%"}
            </span>
            <span className="stats-label">ATS Match Score</span>
          </div>

          {/* Box 2: Completed Interviews */}
          <div className="stats-box">
            <span className="stats-num" style={{ color: "#A8A2FF" }}>
              {profile.interviewCount}
            </span>
            <span className="stats-label">Interviews Done</span>
          </div>

          {/* Box 3: Skills Count */}
          <div className="stats-box">
            <span className="stats-num" style={{ color: "#FFA116" }}>
              {profile.skills.length}
            </span>
            <span className="stats-label">Verified Skills</span>
          </div>
        </div>

        {/* SKILLS SECTION */}
        <div className="profile-card">
          <h3 style={{ fontSize: "1.1rem", margin: "0 0 1.25rem 0", color: "#FFFFFF", fontWeight: "700" }}>
            Technical Skills
          </h3>
          <div className="skills-grid">
            {profile.skills && profile.skills.length > 0 ? (
              profile.skills.map((skill, idx) => (
                <span key={idx} className="skill-badge">
                  {skill}
                </span>
              ))
            ) : (
              <span style={{ fontSize: "0.9rem", color: "#A0AEC0", fontStyle: "italic" }}>
                No verified technical skills listed yet.
              </span>
            )}
          </div>
        </div>

        {/* CAREER READINESS SCORE CARD */}
        <div className="profile-card" style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          {/* Circular SVG Ring */}
          <div style={{ position: "relative", width: "120px", height: "120px", flexShrink: "0" }}>
            <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
              <circle
                cx="60"
                cy="60"
                r={resultRadius}
                fill="transparent"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth={resultStrokeWidth}
              />
              <circle
                cx="60"
                cy="60"
                r={resultRadius}
                fill="transparent"
                stroke="#00D4AA"
                strokeWidth={resultStrokeWidth}
                strokeDasharray={resultCircumference}
                strokeDashoffset={resultStrokeDashoffset}
                style={{ strokeLinecap: "round" }}
              />
            </svg>
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "1.5rem",
              fontWeight: "800",
              color: "#FFFFFF"
            }} className="syne-font">
              {atsVal}%
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", textAlign: "left" }}>
            <h4 style={{ fontSize: "1.05rem", margin: "0", color: "#FFFFFF", fontWeight: "700" }}>
              ATS Compatibility Rating
            </h4>
            <p style={{ margin: "0", fontSize: "0.85rem", color: "#A0AEC0", lineHeight: "1.5" }}>
              {atsVal >= 80 
                ? "Excellent suitability. This profile demonstrates highly aligned keywords and technical skills fitting core requirements." 
                : atsVal >= 60 
                ? "Good suitability. Refined core competencies are established. Candidate is well-positioned for developer tracks." 
                : "Developing suitability. Actively refining skills list and credentials to match target career specifications."}
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <footer style={{
          marginTop: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          paddingTop: "1.5rem"
        }}>
          <span style={{ fontSize: "0.8rem", color: "#A0AEC0" }}>
            Built with <strong>SkillBridge AI</strong>
          </span>
          
          <button
            onClick={() => navigate("/register")}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "6px",
              padding: "0.5rem 1rem",
              color: "#FFFFFF",
              fontSize: "0.8rem",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              transition: "border-color 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "#6C63FF"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
          >
            <span>Create Your Profile</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </footer>

      </div>
    </div>
  );
}

export default PublicProfile;
