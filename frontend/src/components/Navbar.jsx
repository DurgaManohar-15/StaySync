import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Sun, Moon, LogOut, ShieldAlert, Home, Calendar, LayoutDashboard, PlusCircle, User } from "lucide-react";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogoutClick = () => {
    onLogout();
    navigate("/auth");
  };

  // Check if link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "70px",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        background: "var(--bg-navbar)",
        backdropFilter: "var(--glass-blur)",
        WebkitBackdropFilter: "var(--glass-blur)",
        borderBottom: "1px solid var(--border-color)",
        transition: "background var(--transition-normal), border var(--transition-normal)",
      }}
    >
      {/* Brand Logo */}
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, var(--primary), var(--secondary))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            color: "#ffffff",
            fontSize: "1.2rem",
            boxShadow: "0 4px 10px rgba(99, 102, 241, 0.3)",
          }}
        >
          SS
        </div>
        <span
          className="gradient-text"
          style={{
            fontSize: "1.4rem",
            fontWeight: 800,
            letterSpacing: "-0.5px",
            fontFamily: "Outfit, sans-serif",
          }}
        >
          STAY SYNC
        </span>
      </Link>

      {/* Nav Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* Navigation Tabs */}
        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 14px",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: isActive("/") ? "var(--primary)" : "var(--text-muted)",
                background: isActive("/") ? "var(--primary-glow)" : "transparent",
                transition: "all var(--transition-fast)",
              }}
            >
              <Home size={16} />
              <span className="nav-text-desktop">Home</span>
            </Link>

            {user.role === "student" && (
              <>
                <Link
                  to="/student-dashboard"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 14px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: isActive("/student-dashboard") ? "var(--primary)" : "var(--text-muted)",
                    background: isActive("/student-dashboard") ? "var(--primary-glow)" : "transparent",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  <LayoutDashboard size={16} />
                  <span className="nav-text-desktop">Find Hostels</span>
                </Link>

                <Link
                  to="/student-bookings"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 14px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: isActive("/student-bookings") ? "var(--primary)" : "var(--text-muted)",
                    background: isActive("/student-bookings") ? "var(--primary-glow)" : "transparent",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  <Calendar size={16} />
                  <span className="nav-text-desktop">My Bookings</span>
                </Link>
              </>
            )}

            {user.role === "admin" && (
              <>
                <Link
                  to="/admin-dashboard"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 14px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: isActive("/admin-dashboard") ? "var(--primary)" : "var(--text-muted)",
                    background: isActive("/admin-dashboard") ? "var(--primary-glow)" : "transparent",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  <LayoutDashboard size={16} />
                  <span className="nav-text-desktop">Dashboard</span>
                </Link>

                <Link
                  to="/add-hostel"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 14px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: isActive("/add-hostel") ? "var(--primary)" : "var(--text-muted)",
                    background: isActive("/add-hostel") ? "var(--primary-glow)" : "transparent",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  <PlusCircle size={16} />
                  <span className="nav-text-desktop">Add Hostel</span>
                </Link>
              </>
            )}
          </div>
        )}

        {/* Right side utilities */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Light/Dark Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--text-main)",
              transition: "all var(--transition-fast)",
            }}
            title="Toggle Theme"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Auth State Button */}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {/* User badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  background: "var(--border-color)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                {user.isSuperAdmin ? (
                  <ShieldAlert size={14} style={{ color: "var(--secondary)" }} />
                ) : (
                  <User size={14} style={{ color: "var(--primary)" }} />
                )}
                <span>{user.name}</span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    padding: "2px 6px",
                    borderRadius: "10px",
                    background: "var(--bg-app)",
                    color: "var(--text-muted)",
                    textTransform: "capitalize",
                  }}
                >
                  {user.isSuperAdmin ? "Owner / Super" : user.role === "admin" ? "Hostel Owner" : "Student"}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogoutClick}
                className="btn btn-secondary"
                style={{
                  padding: "8px 12px",
                  height: "38px",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                }}
              >
                <LogOut size={16} />
                <span className="nav-text-desktop">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="btn btn-primary"
              style={{
                padding: "8px 20px",
                height: "38px",
                borderRadius: "10px",
                fontSize: "0.85rem",
              }}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
