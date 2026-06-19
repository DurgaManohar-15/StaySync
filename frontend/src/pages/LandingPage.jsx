import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, Shield, Star, Wifi, ShieldCheck, HeartHandshake, Compass } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "80px" }}>
      {/* 1. Hero Section */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "60px 0 20px",
          position: "relative",
        }}
      >
        {/* Glow Background Circle */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)",
            filter: "blur(40px)",
            zIndex: -1,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50px",
            right: "10%",
            width: "250px",
            height: "250px",
            background: "radial-gradient(circle, var(--secondary-glow) 0%, transparent 70%)",
            filter: "blur(40px)",
            zIndex: -1,
          }}
        />

        <span
          style={{
            fontSize: "0.85rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "2px",
            color: "var(--primary)",
            background: "var(--primary-glow)",
            padding: "6px 16px",
            borderRadius: "20px",
            marginBottom: "24px",
            display: "inline-block",
            fontFamily: "Outfit, sans-serif",
          }}
        >
          Co-living Reimagined for Students
        </span>

        <h1
          style={{
            fontSize: "3.5rem",
            fontWeight: 800,
            lineHeight: 1.15,
            maxWidth: "800px",
            marginBottom: "20px",
            fontFamily: "Outfit, sans-serif",
            letterSpacing: "-1px",
          }}
        >
          Your Perfect <span className="gradient-text">Student Hostel & PG</span> Just a Click Away
        </h1>

        <p
          style={{
            fontSize: "1.15rem",
            color: "var(--text-muted)",
            maxWidth: "600px",
            lineHeight: 1.6,
            marginBottom: "40px",
          }}
        >
          Discover premium, fully-managed hostels and co-living PGs near your college. Compare rents, distances, facilities, and book instantly.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={() => navigate("/student-dashboard")}
            className="btn btn-primary"
            style={{ padding: "14px 32px", fontSize: "1rem", borderRadius: "12px" }}
          >
            <Search size={18} />
            Search Near Your College
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="btn btn-secondary"
            style={{ padding: "14px 32px", fontSize: "1rem", borderRadius: "12px" }}
          >
            Hostel Owner Portal
          </button>
        </div>
      </section>

      {/* 2. Visual Banner */}
      <section
        className="glass animate-fade-in"
        style={{
          width: "100%",
          height: "450px",
          position: "relative",
          overflow: "hidden",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <img
          src="/images/hostel_lobby.png"
          alt="Premium Student Co-living Lobby"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.2) 60%, transparent)",
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            color: "#ffffff",
          }}
        >
          <h3 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "8px" }}>Interactive Co-Living Spaces</h3>
          <p style={{ color: "rgba(255, 255, 255, 0.8)", maxWidth: "500px", fontSize: "0.95rem" }}>
            Fully furnished, secure, and collaborative environments optimized for study, recreation, and networking.
          </p>
        </div>
      </section>

      {/* 3. Stats Section */}
      <section className="grid-3">
        <div className="glass" style={{ padding: "30px", textAlign: "center" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--primary)", marginBottom: "10px" }}>0.5 km</h2>
          <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px" }}>Average Proximity</h4>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Hostels and PGs situated right at the walking thresholds of major colleges.</p>
        </div>

        <div className="glass" style={{ padding: "30px", textAlign: "center" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--secondary)", marginBottom: "10px" }}>100%</h2>
          <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px" }}>Owner Verified</h4>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Every property has direct contact info for owners with pre-approved price lists.</p>
        </div>

        <div className="glass" style={{ padding: "30px", textAlign: "center" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--primary)", marginBottom: "10px" }}>24/7</h2>
          <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px" }}>Support & Safety</h4>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>In-app booking oversight, active security protocols, CCTV access, and power backups.</p>
        </div>
      </section>

      {/* 4. Feature Highlights */}
      <section style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "Outfit, sans-serif", marginBottom: "12px" }}>
            Why Students Love Stay Sync
          </h2>
          <p style={{ color: "var(--text-muted)", maxWidth: "500px", margin: "0 auto" }}>
            We've eliminated the friction from student PG hunting. No agents, no commission, total transparency.
          </p>
        </div>

        <div className="grid-4">
          <div className="glass" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "var(--primary-glow)", color: "var(--primary)", display: "flex", alignItems: "center", justifyCenter: "center", display: "inline-flex", justifyContent: "center" }}>
              <Compass size={22} style={{ alignSelf: "center" }} />
            </div>
            <h4 style={{ fontWeight: 700 }}>Search By College</h4>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.5 }}>
              Input your college and see exactly how many kilometers away each PG is. Check transportation flags instantly.
            </p>
          </div>

          <div className="glass" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "var(--secondary-glow)", color: "var(--secondary)", display: "flex", alignItems: "center", justifyCenter: "center", display: "inline-flex", justifyContent: "center" }}>
              <Wifi size={22} style={{ alignSelf: "center" }} />
            </div>
            <h4 style={{ fontWeight: 700 }}>Interactive Sharing Grid</h4>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.5 }}>
              Browse single, double, or triple rooms. Toggling room type dynamically updates the high-res photos and specific pricing.
            </p>
          </div>

          <div className="glass" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "var(--primary-glow)", color: "var(--primary)", display: "flex", alignItems: "center", justifyCenter: "center", display: "inline-flex", justifyContent: "center" }}>
              <ShieldCheck size={22} style={{ alignSelf: "center" }} />
            </div>
            <h4 style={{ fontWeight: 700 }}>Verified Facilities</h4>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.5 }}>
              Detailed specifications on meals (Veg/Non-Veg), Wi-Fi, laundry facilities, study desks, and security guards.
            </p>
          </div>

          <div className="glass" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "var(--secondary-glow)", color: "var(--secondary)", display: "flex", alignItems: "center", justifyCenter: "center", display: "inline-flex", justifyContent: "center" }}>
              <HeartHandshake size={22} style={{ alignSelf: "center" }} />
            </div>
            <h4 style={{ fontWeight: 700 }}>Direct Owner Booking</h4>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.5 }}>
              Submit a booking form directly to the owner. Get status approvals in real-time or trigger Gmail templates to contact them.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Owner Portal Callout */}
      <section
        className="glass"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "40px 60px",
          gap: "40px",
          flexWrap: "wrap",
          borderLeft: "5px solid var(--primary)",
        }}
      >
        <div style={{ flex: "1 1 500px" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "12px", fontFamily: "Outfit, sans-serif" }}>
            Are you a Hostel Owner or PG Admin?
          </h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.5, fontSize: "0.95rem" }}>
            List your properties, configure rooms (single, double, triple sharing with custom pricing & images), receive booking requests, and manage student residents effortlessly.
          </p>
        </div>
        <button
          onClick={() => navigate("/auth?mode=signup&role=admin")}
          className="btn btn-primary"
          style={{ padding: "14px 28px", borderRadius: "12px", whiteSpace: "nowrap" }}
        >
          Register Your PG
        </button>
      </section>
    </div>
  );
}
