import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, User, Radio, ArrowRight, ShieldCheck, Info } from "lucide-react";

export default function Auth({ onLogin }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Tabs: 'login' or 'signup'
  const [isLoginTab, setIsLoginTab] = useState(true);
  
  // Input fields
  const [role, setRole] = useState("student"); // 'student' or 'admin'
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Google Simulator States
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");
  const [customGoogleName, setCustomGoogleName] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Sync role and tab from search parameters if any
  useEffect(() => {
    const roleParam = searchParams.get("role");
    const modeParam = searchParams.get("mode");
    if (roleParam === "admin" || roleParam === "student") setRole(roleParam);
    if (modeParam === "signup") setIsLoginTab(false);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (isLoginTab) {
        // LOGIN REQUEST
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, role }),
        });

        const result = await response.json();

        if (response.ok) {
          onLogin(result.user);
          // Redirect based on role
          if (result.user.role === "admin") {
            navigate("/admin-dashboard");
          } else {
            navigate("/student-dashboard");
          }
        } else {
          setErrorMsg(result.error || "Login failed. Please check your credentials.");
        }
      } else {
        // SIGNUP REQUEST
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password, role }),
        });

        const result = await response.json();

        if (response.ok) {
          setSuccessMsg(result.message || "Signup successful! Please log in.");
          setIsLoginTab(true); // Switch to login tab
          setPassword(""); // Clear password field
        } else {
          setErrorMsg(result.error || "Signup failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      setErrorMsg("Failed to connect to the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (selectedEmail, selectedName) => {
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);
    setShowGoogleModal(false);
    setShowCustomInput(false);

    try {
      const response = await fetch("/api/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: selectedEmail,
          name: selectedName,
          role,
          action: isLoginTab ? "login" : "signup"
        }),
      });

      const result = await response.json();

      if (response.ok) {
        onLogin(result.user);
        if (result.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/student-dashboard");
        }
      } else {
        setErrorMsg(result.error || "Google authentication failed.");
      }
    } catch (err) {
      console.error("Google auth error:", err);
      setErrorMsg("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 0",
        minHeight: "75vh",
      }}
    >
      <div
        className="glass animate-scale-in"
        style={{
          width: "100%",
          maxWidth: "480px",
          padding: "40px",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Tab Headers */}
        <div
          style={{
            display: "flex",
            background: "var(--bg-app)",
            borderRadius: "var(--radius-sm)",
            padding: "4px",
            marginBottom: "30px",
            border: "1px solid var(--border-color)",
          }}
        >
          <button
            onClick={() => {
              setIsLoginTab(true);
              setErrorMsg("");
              setSuccessMsg("");
            }}
            style={{
              flex: 1,
              padding: "10px",
              border: "none",
              borderRadius: "6px",
              background: isLoginTab ? "var(--bg-card)" : "transparent",
              color: isLoginTab ? "var(--text-main)" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              boxShadow: isLoginTab ? "var(--shadow-sm)" : "none",
              transition: "all var(--transition-fast)",
            }}
          >
            Log In
          </button>
          <button
            onClick={() => {
              setIsLoginTab(false);
              setErrorMsg("");
              setSuccessMsg("");
            }}
            style={{
              flex: 1,
              padding: "10px",
              border: "none",
              borderRadius: "6px",
              background: !isLoginTab ? "var(--bg-card)" : "transparent",
              color: !isLoginTab ? "var(--text-main)" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              boxShadow: !isLoginTab ? "var(--shadow-sm)" : "none",
              transition: "all var(--transition-fast)",
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Title */}
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "8px", fontFamily: "Outfit, sans-serif" }}>
          {isLoginTab ? "Welcome Back" : "Create Account"}
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "24px" }}>
          {isLoginTab
            ? "Enter your credentials to manage and find hostels"
            : "Sign up to join our student and owner community"}
        </p>

        {/* Alerts */}
        {errorMsg && (
          <div
            className="badge badge-danger animate-fade-in"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Info size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div
            className="badge badge-success animate-fade-in"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <ShieldCheck size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Dynamic Role Cards Selector */}
          <div className="form-group" style={{ marginBottom: "5px" }}>
            <span className="form-label">Choose Role</span>
            <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
              <div
                onClick={() => setRole("student")}
                style={{
                  flex: 1,
                  padding: "12px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid " + (role === "student" ? "var(--primary)" : "var(--border-color)"),
                  background: role === "student" ? "var(--primary-glow)" : "transparent",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  transition: "all var(--transition-fast)",
                }}
              >
                <span style={{ fontWeight: 700, fontSize: "0.9rem", color: role === "student" ? "var(--primary)" : "var(--text-main)" }}>
                  Student
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Find & book PGs</span>
              </div>

              <div
                onClick={() => setRole("admin")}
                style={{
                  flex: 1,
                  padding: "12px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid " + (role === "admin" ? "var(--primary)" : "var(--border-color)"),
                  background: role === "admin" ? "var(--primary-glow)" : "transparent",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  transition: "all var(--transition-fast)",
                }}
              >
                <span style={{ fontWeight: 700, fontSize: "0.9rem", color: role === "admin" ? "var(--primary)" : "var(--text-main)" }}>
                  Hostel Owner
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>List PGs & bookings</span>
              </div>
            </div>
          </div>

          {/* Username (Signup only) */}
          {!isLoginTab && (
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <div style={{ position: "relative" }}>
                <User
                  size={16}
                  style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
                />
                <input
                  type="text"
                  id="username"
                  className="form-input"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ paddingLeft: "42px" }}
                  required
                />
              </div>
            </div>
          )}

          {/* Email or Username input */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              {isLoginTab ? "Email or Username" : "Email Address"}
            </label>
            <div style={{ position: "relative" }}>
              <Mail
                size={16}
                style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
              />
              <input
                type={isLoginTab ? "text" : "email"}
                id="email"
                className="form-input"
                placeholder={isLoginTab ? "Enter email or username" : "email@example.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: "42px" }}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="pass" className="form-label">
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                size={16}
                style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
              />
              <input
                type="password"
                id="pass"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: "42px" }}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%", padding: "14px", borderRadius: "10px", marginTop: "10px" }}
          >
            {loading ? "Processing..." : isLoginTab ? "Log In" : "Sign Up"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* OR Divider */}
        <div style={{ display: "flex", alignItems: "center", margin: "24px 0", gap: "10px" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }}></div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
            OR
          </span>
          <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }}></div>
        </div>

        {/* Google Auth Button */}
        <button
          type="button"
          onClick={() => setShowGoogleModal(true)}
          className="btn btn-secondary"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            fontWeight: 700,
            fontSize: "0.95rem",
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
          }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" style={{ display: "block" }}>
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          {isLoginTab ? "Login with Google" : "Signup with Google"}
        </button>

        {/* Secret Note for Superadmin */}
        {isLoginTab && role === "admin" && (
          <div
            style={{
              marginTop: "20px",
              padding: "10px",
              borderRadius: "6px",
              background: "var(--bg-app)",
              border: "1px dashed var(--border-color)",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              textAlign: "center",
            }}
          >
            🔑 Hint: Enter the admin monitor login to view the master dashboard.
          </div>
        )}
      </div>

      {/* Google Authentication Simulator Modal */}
      {showGoogleModal && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <div
            className="glass animate-scale-in"
            style={{
              width: "100%",
              maxWidth: "400px",
              background: "var(--bg-app)",
              border: "1px solid var(--border-color)",
              borderRadius: "16px",
              padding: "30px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* Google Brand */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <svg viewBox="0 0 24 24" width="32" height="32" style={{ display: "block" }}>
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginTop: "8px", fontFamily: "Outfit, sans-serif" }}>
                {isLoginTab ? "Google Login" : "Google Sign Up"}
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", textAlign: "center" }}>
                Choose a Google account to continue to <strong className="gradient-text">STAY SYNC</strong>
              </p>
            </div>

            {/* Account List / Selection */}
            {!showCustomInput ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {role === "student" ? (
                  <>
                    <button
                      onClick={() => handleGoogleLogin("amit@student.com", "Amit Verma")}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "10px",
                        border: "1px solid var(--border-color)",
                        background: "var(--bg-card)",
                        color: "var(--text-main)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        transition: "all var(--transition-fast)",
                        textAlign: "left"
                      }}
                    >
                      <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--primary-glow)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem" }}>
                        AV
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: "0.85rem" }}>Amit Verma</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>amit@student.com</p>
                      </div>
                    </button>

                    <button
                      onClick={() => handleGoogleLogin("pooja@student.com", "Pooja Patel")}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "10px",
                        border: "1px solid var(--border-color)",
                        background: "var(--bg-card)",
                        color: "var(--text-main)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        transition: "all var(--transition-fast)",
                        textAlign: "left"
                      }}
                    >
                      <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--primary-glow)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem" }}>
                        PP
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: "0.85rem" }}>Pooja Patel</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>pooja@student.com</p>
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleGoogleLogin("ramesh@hostels.com", "Ramesh Kumar")}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "10px",
                        border: "1px solid var(--border-color)",
                        background: "var(--bg-card)",
                        color: "var(--text-main)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        transition: "all var(--transition-fast)",
                        textAlign: "left"
                      }}
                    >
                      <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--primary-glow)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem" }}>
                        RK
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: "0.85rem" }}>Ramesh Kumar</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>ramesh@hostels.com</p>
                      </div>
                    </button>

                    <button
                      onClick={() => handleGoogleLogin("sita@pgfinder.com", "Sita Reddy")}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "10px",
                        border: "1px solid var(--border-color)",
                        background: "var(--bg-card)",
                        color: "var(--text-main)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        transition: "all var(--transition-fast)",
                        textAlign: "left"
                      }}
                    >
                      <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--primary-glow)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem" }}>
                        SR
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: "0.85rem" }}>Sita Reddy</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>sita@pgfinder.com</p>
                      </div>
                    </button>
                  </>
                )}

                {/* Another Account option */}
                <button
                  onClick={() => setShowCustomInput(true)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "1px dashed var(--border-color)",
                    background: "transparent",
                    color: "var(--primary)",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    transition: "all var(--transition-fast)"
                  }}
                >
                  Use another Gmail account
                </button>
              </div>
            ) : (
              /* Custom Input Form */
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!customGoogleEmail.includes("@") || customGoogleEmail.length < 5) {
                    alert("Please enter a valid Google email address.");
                    return;
                  }
                  handleGoogleLogin(customGoogleEmail, customGoogleName);
                }}
                style={{ display: "flex", flexDirection: "column", gap: "16px" }}
              >
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Google Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="name@gmail.com"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Manohar Roy"
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                  <button
                    type="button"
                    onClick={() => setShowCustomInput(false)}
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: "10px", borderRadius: "8px", fontSize: "0.85rem" }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1, padding: "10px", borderRadius: "8px", fontSize: "0.85rem" }}
                  >
                    Continue
                  </button>
                </div>
              </form>
            )}

            {/* Cancel Button */}
            <button
              onClick={() => {
                setShowGoogleModal(false);
                setShowCustomInput(false);
              }}
              className="btn btn-secondary"
              style={{ width: "100%", padding: "10px", borderRadius: "8px", fontSize: "0.85rem" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
