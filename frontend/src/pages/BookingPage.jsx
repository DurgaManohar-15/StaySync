import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Calendar, FileText, Smartphone, ShieldCheck, User, Info } from "lucide-react";

export default function BookingPage({ user }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const hostelId = searchParams.get("hostelId");
  const sharingType = searchParams.get("sharing");
  const rent = searchParams.get("rent");

  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form inputs
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("male");
  const [collegeName, setCollegeName] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Check auth
    if (!user) {
      alert("Please log in to book a hostel room.");
      navigate("/auth");
      return;
    }

    const fetchHostel = async () => {
      try {
        const response = await fetch("/api/hostels");
        if (response.ok) {
          const list = await response.json();
          const found = list.find((h) => h.id === Number(hostelId));
          setHostel(found);
        }
      } catch (err) {
        console.error("Error loading hostel for booking:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHostel();
  }, [hostelId, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    const bookingPayload = {
      student_id: user.id,
      student_name: user.name,
      email: user.email,
      phone,
      gender,
      college_name: collegeName,
      hostel_id: Number(hostelId),
      hostel_name: hostel ? hostel.name : "Hostel accommodation",
      sharing_type: Number(sharingType),
      rent: Number(rent),
      check_in_date: checkInDate,
    };

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message || "Booking request submitted successfully!");
        navigate("/student-bookings");
      } else {
        setErrorMsg(result.error || "Failed to submit booking request.");
      }
    } catch (err) {
      console.error("Submit booking error:", err);
      setErrorMsg("Failed to connect to the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px" }}>
        <p style={{ color: "var(--text-muted)" }}>Loading booking form...</p>
      </div>
    );
  }

  if (!hostel) {
    return (
      <div style={{ textAlign: "center", padding: "60px" }} className="animate-fade-in">
        <h2 style={{ marginBottom: "14px" }}>Selected Hostel Not Found</h2>
        <Link to="/student-dashboard" className="btn btn-secondary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const sharingName =
    Number(sharingType) === 1 ? "Single Room" : `${sharingType}-Sharing Bed`;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.1fr 0.9fr",
        gap: "30px",
      }}
      className="booking-grid-responsive"
    >
      {/* Left: Booking Form */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="animate-fade-in">
        <div>
          <Link
            to={`/hostels/${hostelId}`}
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
            <ArrowLeft size={16} /> Back to Hostel Details
          </Link>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "Outfit, sans-serif", marginBottom: "8px" }}>
            Book Hostel Room
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Complete the form to request reservation in this accommodation. The owner will review and confirm.
          </p>
        </div>

        {errorMsg && (
          <div
            className="badge badge-danger"
            style={{
              padding: "12px",
              borderRadius: "8px",
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

        <form onSubmit={handleSubmit} className="glass" style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
            Student Information
          </h3>

          {/* Read Only Name & Email */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" value={user.name} disabled style={{ opacity: 0.7 }} />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" value={user.email} disabled style={{ opacity: 0.7 }} />
            </div>
          </div>

          <div className="grid-2">
            {/* Phone Input */}
            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Mobile Number
              </label>
              <div style={{ position: "relative" }}>
                <Smartphone
                  size={16}
                  style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
                />
                <input
                  type="tel"
                  id="phone"
                  placeholder="Enter 10-digit number"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ paddingLeft: "42px" }}
                  pattern="[0-9]{10}"
                  required
                />
              </div>
            </div>

            {/* Gender Select */}
            <div className="form-group">
              <label htmlFor="gender" className="form-label">
                Gender
              </label>
              <select id="gender" className="form-input" value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            {/* College Name */}
            <div className="form-group">
              <label htmlFor="college" className="form-label">
                College Name
              </label>
              <input
                type="text"
                id="college"
                placeholder="e.g. Malla Reddy University"
                className="form-input"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                required
              />
            </div>

            {/* Joining Check-in Date */}
            <div className="form-group">
              <label htmlFor="checkin" className="form-label">
                Expected Joining Date
              </label>
              <div style={{ position: "relative" }}>
                <Calendar
                  size={16}
                  style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
                />
                <input
                  type="date"
                  id="checkin"
                  className="form-input"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  style={{ paddingLeft: "42px" }}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{ width: "100%", padding: "14px", borderRadius: "10px", marginTop: "10px" }}
          >
            {submitting ? "Booking..." : "Submit Reservation Request"}
            {!submitting && <ShieldCheck size={18} />}
          </button>
        </form>
      </div>

      {/* Right: Booking Summary card */}
      <div className="glass animate-scale-in" style={{ padding: "30px", alignSelf: "start" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 800, borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", marginBottom: "20px" }}>
          Reservation Summary
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Hostel Name</span>
            <p style={{ fontWeight: 700, fontSize: "1.1rem" }}>{hostel.name}</p>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>📍 {hostel.location}</p>
          </div>

          <div>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Selected Room Category</span>
            <p style={{ fontWeight: 700 }}>{sharingName}</p>
          </div>

          <div
            style={{
              padding: "16px",
              borderRadius: "10px",
              background: "var(--bg-app)",
              border: "1px solid var(--border-color)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Monthly Rent</span>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>(Includes Wi-Fi & Mess)</p>
            </div>
            <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--primary)" }}>
              ₹{Number(rent).toLocaleString()}
            </span>
          </div>

          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", gap: "8px", background: "rgba(99,102,241,0.04)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(99,102,241,0.1)" }}>
            <FileText size={16} style={{ color: "var(--primary)", flexShrink: 0 }} />
            <span>
              By booking online, you express priority interest. No prepayment is required on STAY SYNC. Payments will be made directly to the owner upon arrival.
            </span>
          </div>
        </div>
      </div>
      
      {/* Styles */}
      <style>{`
        @media (max-width: 820px) {
          .booking-grid-responsive {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
