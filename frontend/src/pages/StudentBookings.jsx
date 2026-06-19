import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle2, XCircle, Calendar, Phone, Mail, User } from "lucide-react";

export default function StudentBookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchStudentBookings();
  }, [user]);

  const fetchStudentBookings = async () => {
    try {
      const response = await fetch(`/api/bookings?email=${encodeURIComponent(user.email)}&role=student`);
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking request?")) return;

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" }),
      });

      if (response.ok) {
        alert("Booking request cancelled successfully!");
        fetchStudentBookings(); // Refresh
      } else {
        alert("Failed to cancel booking request.");
      }
    } catch (err) {
      console.error("Cancel booking error:", err);
      alert("Error connecting to the server.");
    }
  };

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  // Status icon helper
  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle2 size={16} />;
      case "Cancelled":
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Approved":
        return "badge-success";
      case "Cancelled":
        return "badge-danger";
      default:
        return "badge-warning";
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px" }}>
        <p style={{ color: "var(--text-muted)" }}>Loading booking history...</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }} className="animate-fade-in">
      {/* Header */}
      <div>
        <Link
          to="/student-dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.9rem",
            color: "var(--text-muted)",
            fontWeight: 600,
            marginBottom: "16px",
          }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "Outfit, sans-serif", marginBottom: "8px" }}>
          My Bookings History
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Track the status of your room reservation requests and get access to owner contact details.
        </p>
      </div>

      {bookings.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {bookings.map((booking) => {
            const sharingLabel =
              booking.sharing_type === 1 ? "Single Room" : `${booking.sharing_type}-Sharing Bed`;

            return (
              <div
                key={booking.id}
                className="glass"
                style={{
                  padding: "24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "20px",
                  borderLeft: `5px solid ${
                    booking.status === "Approved"
                      ? "var(--success)"
                      : booking.status === "Cancelled"
                      ? "var(--danger)"
                      : "var(--warning)"
                  }`,
                }}
              >
                {/* Details Column */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: "1 1 300px" }}>
                  <div>
                    <span
                      className={`badge ${getStatusBadgeClass(booking.status)}`}
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}
                    >
                      {getStatusIcon(booking.status)}
                      <span>{booking.status}</span>
                    </span>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>{booking.hostel_name}</h3>
                  </div>

                  <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Room Sharing</span>
                      <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{sharingLabel}</p>
                    </div>

                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Monthly Rent</span>
                      <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>₹{booking.rent.toLocaleString()}/mo</p>
                    </div>

                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Expected Joining Date</span>
                      <p style={{ fontWeight: 600, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Calendar size={14} style={{ color: "var(--primary)" }} />
                        {formatDate(booking.check_in_date)}
                      </p>
                    </div>

                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Requested On</span>
                      <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-muted)" }}>
                        {formatDate(booking.booking_date)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Column */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
                  {booking.status === "Pending" && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="btn btn-secondary"
                      style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                        color: "var(--danger-text)",
                        borderColor: "var(--border-color)",
                      }}
                    >
                      Cancel Request
                    </button>
                  )}
                  {booking.status === "Approved" && (
                    <div
                      style={{
                        padding: "12px",
                        background: "var(--bg-app)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                        textAlign: "center",
                      }}
                    >
                      <p style={{ fontWeight: 600, color: "var(--success-text)", marginBottom: "4px" }}>
                        🎉 Request Confirmed!
                      </p>
                      <p style={{ color: "var(--text-muted)" }}>Owner will contact you at {booking.phone}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="glass"
          style={{
            padding: "40px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <Clock size={40} style={{ color: "var(--text-muted)" }} />
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>No bookings yet</h3>
          <p style={{ color: "var(--text-muted)", maxWidth: "400px", fontSize: "0.9rem" }}>
            You haven't requested any hostel bookings yet. Visit the search page to find and book your room!
          </p>
          <Link to="/student-dashboard" className="btn btn-primary" style={{ marginTop: "10px" }}>
            Browse Hostels
          </Link>
        </div>
      )}
    </div>
  );
}
