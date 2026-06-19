import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Mail, User, ShieldCheck, Bus, Utensils, Check, CalendarCheck, HelpCircle } from "lucide-react";

export default function HostelDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    const fetchHostelDetails = async () => {
      try {
        const response = await fetch("/api/hostels");
        if (response.ok) {
          const list = await response.json();
          const found = list.find((h) => h.id === Number(id));
          setHostel(found);
          
          // Pre-select the first room option
          if (found && found.rooms && found.rooms.length > 0) {
            setSelectedRoom(found.rooms[0]);
          }
        }
      } catch (error) {
        console.error("Error loading hostel:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHostelDetails();
  }, [id]);

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  const handleBookNow = () => {
    if (!selectedRoom) return;
    navigate(`/book-hostel?hostelId=${hostel.id}&sharing=${selectedRoom.sharing_type}&rent=${selectedRoom.rent}`);
  };

  const handleExpressInterest = () => {
    if (!hostel || !selectedRoom) return;

    const sharingName =
      selectedRoom.sharing_type === 1
        ? "Single Sharing"
        : `${selectedRoom.sharing_type}-Sharing`;

    const subject = `Interest in ${hostel.name} - ${sharingName}`;
    const body = `Dear Mr/Ms ${hostel.owner_name},\n\nI am a student searching for accommodation and I am highly interested in joining your hostel (${hostel.name}) in a ${sharingName} room (Rent: ₹${selectedRoom.rent.toLocaleString()}/mo).\n\nPlease let me know if a bed is available for check-in and details on reservation steps.\n\nRegards,\n[Your Name]\nMobile: [Your Mobile]`;

    // Direct Gmail compose link
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      hostel.owner_email
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.open(gmailUrl, "_blank");
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px" }}>
        <p style={{ color: "var(--text-muted)" }}>Loading hostel details...</p>
      </div>
    );
  }

  if (!hostel) {
    return (
      <div style={{ textAlign: "center", padding: "60px" }} className="animate-fade-in">
        <h2 style={{ marginBottom: "14px" }}>Hostel Not Found</h2>
        <Link to="/student-dashboard" className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }} className="animate-fade-in">
      {/* Back button */}
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
          }}
        >
          <ArrowLeft size={16} /> Back to Accommodations List
        </Link>
      </div>

      {/* Main Grid: Details Left, Interactive Room Selection Right */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: "30px",
        }}
        className="details-grid-responsive"
      >
        {/* Left Column: Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Title Card */}
          <div className="glass" style={{ padding: "30px" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "Outfit, sans-serif", marginBottom: "10px" }}>
              {hostel.name}
            </h1>
            <p style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.95rem", marginBottom: "16px" }}>
              <MapPin size={16} style={{ color: "var(--primary)" }} />
              <span>{hostel.address}</span>
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
              <span className="badge badge-success" style={{ padding: "6px 12px", fontSize: "0.85rem" }}>
                📍 {hostel.distance} km from College
              </span>
              {hostel.food === "Yes" && (
                <span className="badge badge-success" style={{ padding: "6px 12px", fontSize: "0.85rem", background: "var(--success-bg)", color: "var(--success-text)" }}>
                  🍳 Meals Included
                </span>
              )}
              {hostel.transport === "Yes" && (
                <span className="badge badge-success" style={{ padding: "6px 12px", fontSize: "0.85rem", background: "var(--success-bg)", color: "var(--success-text)" }}>
                  🚌 Transport Provided
                </span>
              )}
            </div>
          </div>

          {/* Amenities & Description */}
          <div className="glass" style={{ padding: "30px" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "16px", fontFamily: "Outfit, sans-serif" }}>
              Hostel Amenities
            </h3>
            {hostel.facilities && hostel.facilities.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: "14px",
                }}
              >
                {hostel.facilities.map((fac, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem" }}>
                    <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "var(--primary-glow)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Check size={12} />
                    </div>
                    <span>{fac}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No list of facilities provided.</p>
            )}
          </div>

          {/* Contact Owner */}
          <div className="glass" style={{ padding: "30px" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "16px", fontFamily: "Outfit, sans-serif" }}>
              Owner Contact Info
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <User size={18} style={{ color: "var(--text-muted)" }} />
                <div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Owner Name</p>
                  <p style={{ fontWeight: 600 }}>{hostel.owner_name}</p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Phone size={18} style={{ color: "var(--text-muted)" }} />
                <div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Mobile Number</p>
                  <p style={{ fontWeight: 600 }}>+91 {hostel.owner_mobile}</p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Mail size={18} style={{ color: "var(--text-muted)" }} />
                <div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Email Address</p>
                  <p style={{ fontWeight: 600 }}>{hostel.owner_email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Room Selector */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="glass" style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, fontFamily: "Outfit, sans-serif" }}>
              Select Room Type
            </h3>

            {/* Sharing Type Selector Buttons */}
            {hostel.rooms && hostel.rooms.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {hostel.rooms.map((room) => {
                  const label =
                    room.sharing_type === 1
                      ? "Single Room"
                      : `${room.sharing_type}-Sharing Bed`;
                  const active = selectedRoom && selectedRoom.id === room.id;

                  return (
                    <button
                      key={room.id}
                      onClick={() => handleRoomSelect(room)}
                      style={{
                        width: "100%",
                        padding: "14px 18px",
                        borderRadius: "12px",
                        border: "1px solid " + (active ? "var(--primary)" : "var(--border-color)"),
                        background: active ? "var(--primary-glow)" : "var(--bg-app)",
                        color: active ? "var(--primary)" : "var(--text-main)",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        transition: "all var(--transition-fast)",
                      }}
                    >
                      <span>{label}</span>
                      <span>₹{room.rent.toLocaleString()}/mo</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)" }}>
                No rooms configured for this hostel.
              </div>
            )}

            {/* Selected Room Details card */}
            {selectedRoom && (
              <div
                className="animate-fade-in"
                style={{
                  borderTop: "1px solid var(--border-color)",
                  paddingTop: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                {/* Dynamically Loaded Room Image */}
                <div
                  style={{
                    height: "180px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <img
                    src={selectedRoom.image_url || "/images/double_room.jpg"}
                    alt="Room type image"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = "/images/double_room.jpg";
                    }}
                  />
                </div>

                {/* Details */}
                <div style={{ display: "flex", justifyBetween: "space-between", flexWrap: "wrap", gap: "10px", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Room Category</span>
                    <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                      {selectedRoom.sharing_type === 1 ? "Single Room" : `${selectedRoom.sharing_type}-Sharing`}
                    </h4>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Available Beds</span>
                    <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--secondary)" }}>
                      {selectedRoom.available_beds} Beds left
                    </h4>
                  </div>
                </div>

                <div
                  style={{
                    background: "var(--bg-app)",
                    padding: "12px",
                    borderRadius: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>Rent (Meals Included)</span>
                  <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--primary)" }}>
                    ₹{selectedRoom.rent.toLocaleString()}
                  </span>
                </div>

                {/* Booking buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
                  <button
                    onClick={handleBookNow}
                    className="btn btn-primary"
                    style={{ width: "100%", borderRadius: "10px", padding: "14px" }}
                  >
                    <CalendarCheck size={18} />
                    Book This Room Online
                  </button>
                  <button
                    onClick={handleExpressInterest}
                    className="btn btn-secondary"
                    style={{ width: "100%", borderRadius: "10px", padding: "14px" }}
                  >
                    Express Interest via Email
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Dynamic responsive CSS */}
      <style>{`
        @media (max-width: 820px) {
          .details-grid-responsive {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
