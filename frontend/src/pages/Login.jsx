import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" }); // { message: '...', type: 'success' | 'error' }

  const navigate = useNavigate();

  const triggerToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => {
      setToast({ message: "", type: "" });
    }, 3000);
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    
    if (!email || !password) {
      triggerToast("Please enter both email and password.", "error");
      return;
    }

    setLoading(true);

    try {
      // Changed to use relative path (proxied)
      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Save user to localStorage key "user" and token to key "token"
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        triggerToast("Login Successful! Redirecting...", "success");
        
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        triggerToast(data.message || "Invalid credentials. Please try again.", "error");
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
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to resume your placement journey</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="auth-input-group">
            <label className="auth-label">Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;