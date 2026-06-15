import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" }); // { message: '...', type: 'success' | 'error' }
  const navigate = useNavigate();

  const triggerToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => {
      setToast({ message: "", type: "" });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    if (e) e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      triggerToast("Please fill in all the fields.", "error");
      return;
    }

    setLoading(true);

    try {
      // Changed to use relative path (proxied)
      const response = await fetch(
        "/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        triggerToast("Registration Successful! Redirecting to Login...", "success");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        triggerToast(data.message || "Registration failed. Please try again.", "error");
      }
    } catch (err) {
      console.error(err);
      triggerToast("Unable to connect to the server. Please check your connection.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      {/* Viewport bottom-right toast */}
      {toast.message && (
        <div className={`global-toast ${toast.type === "error" ? "toast-error" : "toast-success"}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "8px" }}>
            {toast.type === "error" ? (
              <>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </>
            ) : (
              <polyline points="20 6 9 17 4 12" />
            )}
          </svg>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Background Glows */}
      <div className="auth-glow-1"></div>
      <div className="auth-glow-2"></div>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" opacity="0.3"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span>SkillBridge AI</span>
          </div>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join us to start bridging your skill gaps</p>
        </div>

        <form onSubmit={handleRegister} className="auth-form">
          <div className="auth-input-group">
            <label className="auth-label">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              className="auth-input"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="name@company.com"
              className="auth-input"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="auth-input"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="auth-spinner"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;