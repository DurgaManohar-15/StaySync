import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

// Pages
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import StudentDashboard from "./pages/StudentDashboard";
import HostelDetailsPage from "./pages/HostelDetailsPage";
import BookingPage from "./pages/BookingPage";
import StudentBookings from "./pages/StudentBookings";
import AdminDashboard from "./pages/AdminDashboard";
import AddHostelPage from "./pages/AddHostelPage";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const savedUser = sessionStorage.getItem("loggedInUser");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Failed to parse saved user:", err);
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    sessionStorage.setItem("loggedInUser", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem("loggedInUser");
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Starting STAY SYNC...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        {/* Global Navigation Bar */}
        <Navbar user={user} onLogout={handleLogout} />

        {/* Content View wrapper */}
        <main className="content-wrapper">
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/auth"
              element={
                user ? (
                  user.role === "admin" ? (
                    <Navigate to="/admin-dashboard" replace />
                  ) : (
                    <Navigate to="/student-dashboard" replace />
                  )
                ) : (
                  <Auth onLogin={handleLogin} />
                )
              }
            />

            {/* Student Protected Routes */}
            <Route
              path="/student-dashboard"
              element={
                user ? (
                  user.role === "student" ? (
                    <StudentDashboard />
                  ) : (
                    <Navigate to="/admin-dashboard" replace />
                  )
                ) : (
                  <Navigate to="/auth?role=student" replace />
                )
              }
            />
            <Route
              path="/hostels/:id"
              element={
                user ? (
                  user.role === "student" ? (
                    <HostelDetailsPage />
                  ) : (
                    <Navigate to="/admin-dashboard" replace />
                  )
                ) : (
                  <Navigate to="/auth?role=student" replace />
                )
              }
            />
            <Route
              path="/book-hostel"
              element={
                user ? (
                  user.role === "student" ? (
                    <BookingPage user={user} />
                  ) : (
                    <Navigate to="/admin-dashboard" replace />
                  )
                ) : (
                  <Navigate to="/auth?role=student" replace />
                )
              }
            />
            <Route
              path="/student-bookings"
              element={
                user ? (
                  user.role === "student" ? (
                    <StudentBookings user={user} />
                  ) : (
                    <Navigate to="/admin-dashboard" replace />
                  )
                ) : (
                  <Navigate to="/auth?role=student" replace />
                )
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin-dashboard"
              element={
                user ? (
                  user.role === "admin" ? (
                    <AdminDashboard user={user} />
                  ) : (
                    <Navigate to="/student-dashboard" replace />
                  )
                ) : (
                  <Navigate to="/auth?role=admin" replace />
                )
              }
            />
            <Route
              path="/add-hostel"
              element={
                user ? (
                  user.role === "admin" ? (
                    <AddHostelPage user={user} />
                  ) : (
                    <Navigate to="/student-dashboard" replace />
                  )
                ) : (
                  <Navigate to="/auth?role=admin" replace />
                )
              }
            />

            {/* Redirect any other path to landing page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
