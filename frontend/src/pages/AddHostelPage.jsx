import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Home, Bed, Info, PlusCircle, CheckCircle } from "lucide-react";

export default function AddHostelPage({ user }) {
  const navigate = useNavigate();

  // General property states
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [facilities, setFacilities] = useState("WiFi, Mess, Laundry, Hot Water, 24/7 Security");
  const [transport, setTransport] = useState("No");
  const [distance, setDistance] = useState(0.5);
  const [food, setFood] = useState("Yes");
  const [ownerMobile, setOwnerMobile] = useState("");

  // Room config states
  const [roomsList, setRoomsList] = useState([
    { sharing_type: 2, rent: 8000, available_beds: 4, image_url: "/images/double_room.jpg" }
  ]);

  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Check auth
    if (!user || user.role !== "admin") {
      alert("Unauthorized access!");
      navigate("/auth");
    }
  }, [user, navigate]);

  // Dynamic Room List handlers
  const handleAddRoomRow = () => {
    setRoomsList([
      ...roomsList,
      { sharing_type: 1, rent: 10000, available_beds: 2, image_url: "/images/single_room.jpg" }
    ]);
  };

  const handleRemoveRoomRow = (index) => {
    if (roomsList.length === 1) {
      alert("You must define at least one room configuration.");
      return;
    }
    const updated = [...roomsList];
    updated.splice(index, 1);
    setRoomsList(updated);
  };

  const handleRoomChange = (index, field, value) => {
    const updated = [...roomsList];
    
    // Auto-select standard seed image based on sharing type chosen for convenience
    if (field === "sharing_type") {
      const type = Number(value);
      updated[index][field] = type;
      if (type === 1) updated[index]["image_url"] = "/images/single_room.jpg";
      else if (type === 2) updated[index]["image_url"] = "/images/double_room.jpg";
      else if (type === 3) updated[index]["image_url"] = "/images/triple_room.jpg";
      else if (type === 4) updated[index]["image_url"] = "/images/quad_room.jpg";
    } else {
      updated[index][field] = field === "rent" || field === "available_beds" ? Number(value) : value;
    }
    
    setRoomsList(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Validate rooms
    if (roomsList.some((r) => !r.rent || r.rent <= 0 || !r.available_beds || r.available_beds <= 0)) {
      setErrorMsg("Please make sure all room configurations have valid rent and available beds.");
      return;
    }

    setSubmitting(true);

    const payload = {
      owner_id: user.id,
      name,
      location,
      address,
      facilities,
      transport,
      distance: Number(distance),
      food,
      owner_name: user.name,
      owner_email: user.email,
      owner_mobile: ownerMobile,
      rooms: roomsList
    };

    try {
      const response = await fetch("/api/hostels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message || "Hostel listing added successfully!");
        navigate("/admin-dashboard");
      } else {
        setErrorMsg(result.error || "Failed to add hostel.");
      }
    } catch (err) {
      console.error("Add hostel error:", err);
      setErrorMsg("Failed to connect to the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }} className="animate-fade-in">
      {/* Header */}
      <div>
        <Link
          to="/admin-dashboard"
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
          Register New Hostel / PG
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Add your property specifications, configure room categories (sharing counts & rents), and start receiving student bookings.
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

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        {/* Step 1: General Details */}
        <div className="glass" style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Home size={18} style={{ color: "var(--primary)" }} />
            Property General Details
          </h3>

          <div className="grid-2">
            <div className="form-group">
              <label htmlFor="hostelName" className="form-label">Hostel Name</label>
              <input
                type="text"
                id="hostelName"
                className="form-input"
                placeholder="e.g. Malla Reddy University Boys Hostel"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="collegeLoc" className="form-label">Near College / Area Location</label>
              <input
                type="text"
                id="collegeLoc"
                className="form-input"
                placeholder="e.g. Malla Reddy University"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="fullAddr" className="form-label">Full Address</label>
            <textarea
              id="fullAddr"
              className="form-input"
              placeholder="Enter exact address with street and landmark"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ minHeight: "80px", resize: "vertical" }}
              required
            />
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label htmlFor="dist" className="form-label">Distance from college (km)</label>
              <input
                type="number"
                id="dist"
                className="form-input"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                step="0.1"
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="foodOpt" className="form-label">Food Available (Meals/Mess)</label>
              <select id="foodOpt" className="form-input" value={food} onChange={(e) => setFood(e.target.value)}>
                <option value="Yes">Yes (Meals Included)</option>
                <option value="No">No (Self Catering)</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="transOpt" className="form-label">College Bus/Transport Availability</label>
              <select id="transOpt" className="form-input" value={transport} onChange={(e) => setTransport(e.target.value)}>
                <option value="No">No (No Pick-up/Drop)</option>
                <option value="Yes">Yes (Transport Available)</option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label htmlFor="ownerMobile" className="form-label">Your Mobile Number</label>
              <input
                type="tel"
                id="ownerMobile"
                placeholder="10-digit number"
                className="form-input"
                value={ownerMobile}
                onChange={(e) => setOwnerMobile(e.target.value)}
                pattern="[0-9]{10}"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">List Facilities (Comma Separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="WiFi, Mess, Laundry, Hot Water, Security"
                value={facilities}
                onChange={(e) => setFacilities(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Step 2: Rooms Configuration */}
        <div className="glass" style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px" }}>
              <Bed size={18} style={{ color: "var(--primary)" }} />
              Configure Room Sharing & Rents
            </h3>
            <button
              type="button"
              onClick={handleAddRoomRow}
              className="btn btn-secondary"
              style={{ padding: "6px 12px", borderRadius: "8px", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <PlusCircle size={14} /> Add Room Category
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {roomsList.map((room, index) => (
              <div
                key={index}
                className="animate-fade-in"
                style={{
                  background: "var(--bg-app)",
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid var(--border-color)",
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1fr 1fr 1.5fr 0.3fr",
                  gap: "16px",
                  alignItems: "end"
                }}
                className="room-row-responsive"
              >
                {/* Sharing count */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Sharing Count</label>
                  <select
                    className="form-input"
                    value={room.sharing_type}
                    onChange={(e) => handleRoomChange(index, "sharing_type", e.target.value)}
                  >
                    <option value="1">Single Occupancy</option>
                    <option value="2">2-Sharing</option>
                    <option value="3">3-Sharing</option>
                    <option value="4">4-Sharing</option>
                  </select>
                </div>

                {/* Rent */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Monthly Rent (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Rent per bed"
                    value={room.rent}
                    onChange={(e) => handleRoomChange(index, "rent", e.target.value)}
                    min="1000"
                    required
                  />
                </div>

                {/* Available beds */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Available Beds</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Beds available"
                    value={room.available_beds}
                    onChange={(e) => handleRoomChange(index, "available_beds", e.target.value)}
                    min="1"
                    required
                  />
                </div>

                {/* Image Selection */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Room Image Preview</label>
                  <select
                    className="form-input"
                    value={room.image_url}
                    onChange={(e) => handleRoomChange(index, "image_url", e.target.value)}
                  >
                    <option value="/images/single_room.jpg">Premium Single Room Photo</option>
                    <option value="/images/double_room.jpg">Premium Double Room Photo</option>
                    <option value="/images/triple_room.jpg">Premium Triple Room Photo</option>
                    <option value="/images/quad_room.jpg">Premium Quad Room Photo</option>
                  </select>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemoveRoomRow(index)}
                  className="btn btn-secondary"
                  style={{
                    color: "var(--danger-text)",
                    borderColor: "var(--border-color)",
                    padding: "12px",
                    width: "46px",
                    height: "46px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  title="Remove configuration"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Form Submission */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{ padding: "14px 40px", borderRadius: "12px", fontSize: "1rem" }}
          >
            {submitting ? "Saving listing..." : "Publish Hostel & PG Listing"}
            {!submitting && <CheckCircle size={18} />}
          </button>
        </div>
      </form>

      {/* CSS for responsive room row */}
      <style>{`
        @media (max-width: 820px) {
          .room-row-responsive {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
