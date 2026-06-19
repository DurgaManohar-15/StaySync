import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Home, CalendarCheck, Check, X, Trash2, Plus, RefreshCw, Eye, Info } from "lucide-react";

export default function AdminDashboard({ user }) {
  const navigate = useNavigate();
  const isSuper = user && user.email === "superadmin@staysync.com";

  // Data states
  const [hostels, setHostels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tab state (for Super Admin dashboard controls)
  // 'hostels', 'bookings', 'users'
  const [activeTab, setActiveTab] = useState("bookings");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      alert("Unauthorized access!");
      navigate("/auth");
      return;
    }
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Hostels (scoping is handled automatically by backend query parameters)
      const hostelsUrl = `/api/hostels?ownerEmail=${encodeURIComponent(user.email)}&userRole=admin`;
      const hostelsRes = await fetch(hostelsUrl);
      const hostelsData = hostelsRes.ok ? await hostelsRes.json() : [];
      setHostels(hostelsData);

      // 2. Fetch Bookings (scoping handled by backend)
      const bookingsUrl = `/api/bookings?email=${encodeURIComponent(user.email)}&role=admin`;
      const bookingsRes = await fetch(bookingsUrl);
      const bookingsData = bookingsRes.ok ? await bookingsRes.json() : [];
      setBookings(bookingsData);

      // 3. Fetch Users (Only if Super Admin)
      if (isSuper) {
        const usersRes = await fetch("/api/users");
        const usersData = usersRes.ok ? await usersRes.json() : [];
        setUsersList(usersData);
      }
    } catch (err) {
      console.error("Error loading admin dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        alert(`Booking request ${newStatus.toLowerCase()} successfully!`);
        loadDashboardData(); // Reload
      } else {
        alert("Failed to update booking status.");
      }
    } catch (err) {
      console.error("Error updating booking:", err);
    }
  };

  const handleDeleteHostel = async (hostelId) => {
    if (!confirm("Are you sure you want to delete this hostel? All room categories and bookings associated will be removed!")) return;

    try {
      const response = await fetch(`/api/hostels/${hostelId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Hostel deleted successfully.");
        loadDashboardData(); // Reload
      } else {
        alert("Failed to delete hostel.");
      }
    } catch (err) {
      console.error("Error deleting hostel:", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user? Their registered PGs and bookings will be deleted!")) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("User deleted from the system.");
        loadDashboardData(); // Reload
      } else {
        alert("Failed to delete user.");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  // Helper to get minimum rent of a hostel
  const getMinRent = (hostel) => {
    if (!hostel.rooms || hostel.rooms.length === 0) return 0;
    return Math.min(...hostel.rooms.map((r) => r.rent));
  };

  // KPI Calculations
  const totalHostelsCount = hostels.length;
  const totalBookingsCount = bookings.length;
  const pendingBookingsCount = bookings.filter((b) => b.status === "Pending").length;
  const approvedBookingsCount = bookings.filter((b) => b.status === "Approved").length;

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px" }}>
        <p style={{ color: "var(--text-muted)" }}>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }} className="animate-fade-in">
      {/* Header Banner */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "Outfit, sans-serif", marginBottom: "8px" }}>
            {isSuper ? "Master Systems Monitoring" : "Owner Dashboard"}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            {isSuper
              ? "You are logged in as administrator. Real-time control over all students, hostel owners, list assets, and bookings."
              : `Welcome, ${user.name}. Manage your PGs, update rents, and review student joining schedules.`}
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={loadDashboardData}
            className="btn btn-secondary"
            style={{ width: "42px", height: "42px", borderRadius: "10px", padding: 0 }}
            title="Refresh Data"
          >
            <RefreshCw size={16} />
          </button>
          {!isSuper && (
            <Link to="/add-hostel" className="btn btn-primary" style={{ borderRadius: "10px", padding: "0 20px", display: "inline-flex", height: "42px" }}>
              <Plus size={16} /> Add Hostel
            </Link>
          )}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid-4">
        {/* KPI 1 */}
        <div className="glass" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ width: "46px", height: "46px", borderRadius: "10px", background: "var(--primary-glow)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Home size={22} />
          </div>
          <div>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>
              {isSuper ? "Total Hostels listed" : "My Hostels"}
            </span>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginTop: "4px" }}>{totalHostelsCount}</h2>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="glass" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ width: "46px", height: "46px", borderRadius: "10px", background: "var(--secondary-glow)", color: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CalendarCheck size={22} />
          </div>
          <div>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>
              {isSuper ? "Total Bookings" : "Total Requests"}
            </span>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginTop: "4px" }}>{totalBookingsCount}</h2>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="glass" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ width: "46px", height: "46px", borderRadius: "10px", background: "var(--warning-bg)", color: "var(--warning-text)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CalendarCheck size={22} />
          </div>
          <div>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>
              Pending Review
            </span>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginTop: "4px", color: "var(--warning-text)" }}>{pendingBookingsCount}</h2>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="glass" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ width: "46px", height: "46px", borderRadius: "10px", background: isSuper ? "var(--primary-glow)" : "var(--success-bg)", color: isSuper ? "var(--primary)" : "var(--success-text)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {isSuper ? <Users size={22} /> : <Check size={22} />}
          </div>
          <div>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>
              {isSuper ? "Total Platform Users" : "Approved Joins"}
            </span>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginTop: "4px" }}>
              {isSuper ? usersList.length : approvedBookingsCount}
            </h2>
          </div>
        </div>
      </div>

      {/* Super Admin Tab Controller */}
      {isSuper && (
        <div
          style={{
            display: "flex",
            gap: "10px",
            borderBottom: "1px solid var(--border-color)",
            paddingBottom: "10px",
          }}
        >
          <button
            onClick={() => setActiveTab("bookings")}
            className="btn"
            style={{
              padding: "10px 20px",
              background: activeTab === "bookings" ? "var(--primary)" : "transparent",
              color: activeTab === "bookings" ? "#ffffff" : "var(--text-main)",
              borderRadius: "8px",
              fontSize: "0.9rem",
            }}
          >
            System Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab("hostels")}
            className="btn"
            style={{
              padding: "10px 20px",
              background: activeTab === "hostels" ? "var(--primary)" : "transparent",
              color: activeTab === "hostels" ? "#ffffff" : "var(--text-main)",
              borderRadius: "8px",
              fontSize: "0.9rem",
            }}
          >
            All Registered Hostels ({hostels.length})
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className="btn"
            style={{
              padding: "10px 20px",
              background: activeTab === "users" ? "var(--primary)" : "transparent",
              color: activeTab === "users" ? "#ffffff" : "var(--text-main)",
              borderRadius: "8px",
              fontSize: "0.9rem",
            }}
          >
            Monitor Users ({usersList.length})
          </button>
        </div>
      )}

      {/* RENDER VIEW: BOOKINGS MANAGEMENT (default for both standard owner and superadmin tab) */}
      {(!isSuper || activeTab === "bookings") && (
        <section className="glass" style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, fontFamily: "Outfit, sans-serif" }}>
              {isSuper ? "All Student Bookings" : "Booking Requests Received"}
            </h3>
          </div>

          {bookings.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Student Details</th>
                    <th>College</th>
                    <th>PG/Hostel Choice</th>
                    <th>Room Type</th>
                    <th>Check-in Date</th>
                    <th>Rent</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const sharingName =
                      booking.sharing_type === 1 ? "Single Room" : `${booking.sharing_type}-Sharing`;

                    return (
                      <tr key={booking.id}>
                        <td>
                          <div style={{ fontWeight: 700 }}>{booking.student_name}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{booking.email}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>📞 {booking.phone}</div>
                        </td>
                        <td>{booking.college_name}</td>
                        <td>{booking.hostel_name}</td>
                        <td>
                          <span className="badge badge-success" style={{ background: "var(--primary-glow)", color: "var(--primary)", fontSize: "0.75rem" }}>
                            {sharingName}
                          </span>
                        </td>
                        <td>{formatDate(booking.check_in_date)}</td>
                        <td style={{ fontWeight: 700 }}>₹{booking.rent.toLocaleString()}</td>
                        <td>
                          <span
                            className={`badge ${
                              booking.status === "Approved"
                                ? "badge-success"
                                : booking.status === "Cancelled"
                                ? "badge-danger"
                                : "badge-warning"
                            }`}
                            style={{ fontSize: "0.75rem" }}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td>
                          {booking.status === "Pending" ? (
                            <div style={{ display: "flex", gap: "6px" }}>
                              <button
                                onClick={() => handleUpdateBookingStatus(booking.id, "Approved")}
                                className="btn btn-primary"
                                style={{
                                  padding: "6px 10px",
                                  borderRadius: "6px",
                                  fontSize: "0.75rem",
                                  background: "var(--success)",
                                  boxShadow: "none",
                                }}
                                title="Approve Student"
                              >
                                <Check size={14} /> Approve
                              </button>
                              <button
                                onClick={() => handleUpdateBookingStatus(booking.id, "Cancelled")}
                                className="btn btn-secondary"
                                style={{
                                  padding: "6px 10px",
                                  borderRadius: "6px",
                                  fontSize: "0.75rem",
                                  color: "var(--danger-text)",
                                  borderColor: "var(--border-color)",
                                }}
                                title="Reject Request"
                              >
                                <X size={14} /> Reject
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>No actions</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
              No student bookings received yet.
            </div>
          )}
        </section>
      )}

      {/* RENDER VIEW: HOSTELS MANAGEMENT */}
      {(!isSuper || activeTab === "hostels") && (
        <section className="glass" style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, fontFamily: "Outfit, sans-serif" }}>
            {isSuper ? "All Registered Hostel Assets" : "My Registered Hostels"}
          </h3>

          {hostels.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Hostel Details</th>
                    <th>Near College</th>
                    <th>Starting Rent</th>
                    <th>Distance</th>
                    <th>Meals</th>
                    <th>Transport</th>
                    {isSuper && <th>Owner Info</th>}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hostels.map((hostel) => {
                    const minRent = getMinRent(hostel);
                    return (
                      <tr key={hostel.id}>
                        <td>
                          <div style={{ fontWeight: 700 }}>{hostel.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>📍 {hostel.address}</div>
                        </td>
                        <td>{hostel.location}</td>
                        <td style={{ fontWeight: 700, color: "var(--primary)" }}>
                          {minRent > 0 ? `₹${minRent.toLocaleString()}` : "Not Configured"}
                        </td>
                        <td>{hostel.distance} km</td>
                        <td>
                          <span className={`badge ${hostel.food === "Yes" ? "badge-success" : "badge-warning"}`}>
                            {hostel.food === "Yes" ? "Meals Included" : "Self Mess"}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${hostel.transport === "Yes" ? "badge-success" : "badge-warning"}`}>
                            {hostel.transport === "Yes" ? "Bus Available" : "No transport"}
                          </span>
                        </td>
                        {isSuper && (
                          <td>
                            <div style={{ fontWeight: 600 }}>{hostel.owner_name}</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{hostel.owner_email}</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>📞 {hostel.owner_mobile}</div>
                          </td>
                        )}
                        <td>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button
                              onClick={() => navigate(`/hostels/${hostel.id}`)}
                              className="btn btn-secondary"
                              style={{ padding: "6px 10px", borderRadius: "6px", fontSize: "0.75rem" }}
                            >
                              <Eye size={12} /> View
                            </button>
                            <button
                              onClick={() => handleDeleteHostel(hostel.id)}
                              className="btn btn-secondary"
                              style={{
                                padding: "6px 10px",
                                borderRadius: "6px",
                                fontSize: "0.75rem",
                                color: "var(--danger-text)",
                                borderColor: "var(--border-color)",
                              }}
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
              No hostels registered yet. Click "Add Hostel" to register one.
            </div>
          )}
        </section>
      )}

      {/* RENDER VIEW: MONITOR USERS (Super Admin Only) */}
      {isSuper && activeTab === "users" && (
        <section className="glass" style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, fontFamily: "Outfit, sans-serif" }}>
            Monitor Registered Users
          </h3>

          {usersList.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>User Name</th>
                    <th>Email Address</th>
                    <th>Platform Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((usr) => (
                    <tr key={usr.id}>
                      <td style={{ fontWeight: 600 }}>#{usr.id}</td>
                      <td style={{ fontWeight: 700 }}>{usr.name}</td>
                      <td>{usr.email}</td>
                      <td>
                        <span
                          className={`badge ${usr.role === "admin" ? "badge-success" : "badge-warning"}`}
                          style={{
                            background: usr.role === "admin" ? "var(--primary-glow)" : "rgba(20, 184, 166, 0.1)",
                            color: usr.role === "admin" ? "var(--primary)" : "var(--secondary)",
                            textTransform: "capitalize",
                          }}
                        >
                          {usr.role === "admin" ? "Hostel Owner" : "Student"}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteUser(usr.id)}
                          className="btn btn-secondary"
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            color: "var(--danger-text)",
                            borderColor: "var(--border-color)",
                          }}
                        >
                          <Trash2 size={12} style={{ marginRight: "4px" }} /> Delete User
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
              No registered students or owners found in the system.
            </div>
          )}
        </section>
      )}
    </div>
  );
}
