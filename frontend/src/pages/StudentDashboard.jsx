import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, SlidersHorizontal, Bus, Utensils, IndianRupee, Compass, ChevronRight, AlertCircle } from "lucide-react";

export default function StudentDashboard() {
  const navigate = useNavigate();
  
  // Search state
  const [searchVal, setSearchVal] = useState("");
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Filters state
  const [showFilters, setShowFilters] = useState(false);
  const [maxRent, setMaxRent] = useState(15000);
  const [maxDistance, setMaxDistance] = useState(5.0);
  const [reqFood, setReqFood] = useState("any"); // 'any' or 'yes'
  const [reqTransport, setReqTransport] = useState("any"); // 'any' or 'yes'

  // Load standard seed search on mount
  useEffect(() => {
    // Optionally pre-load hostels or let student search. Let's pre-load all hostels.
    fetchHostels("");
  }, []);

  const fetchHostels = async (searchQuery) => {
    setLoading(true);
    try {
      const url = searchQuery
        ? `/api/hostels?search=${encodeURIComponent(searchQuery)}`
        : "/api/hostels";
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.ok ? await response.json() : [];
        setHostels(data);
      }
    } catch (error) {
      console.error("Error fetching hostels:", error);
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHostels(searchVal);
  };

  const handleQuickSearch = (collegeName) => {
    setSearchVal(collegeName);
    fetchHostels(collegeName);
  };

  // Helper to get minimum rent of a hostel
  const getMinRent = (hostel) => {
    if (!hostel.rooms || hostel.rooms.length === 0) return 0;
    return Math.min(...hostel.rooms.map((r) => r.rent));
  };

  // Filtering logic on client-side
  const filteredHostels = hostels.filter((hostel) => {
    const minRent = getMinRent(hostel);
    
    // Rent filter (if no rooms, budget is 0, let it pass if maxRent is high)
    if (minRent > maxRent) return false;
    
    // Distance filter
    if (hostel.distance > maxDistance) return false;
    
    // Food filter
    if (reqFood === "yes" && hostel.food !== "Yes") return false;
    
    // Transport filter
    if (reqTransport === "yes" && hostel.transport !== "Yes") return false;

    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }} className="animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "Outfit, sans-serif", marginBottom: "8px" }}>
          Find Student Accommodations
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Enter your institution name to discover premium co-living PGs and private hostels nearby.
        </p>
      </div>

      {/* Search Engine Area */}
      <div
        className="glass"
        style={{
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          borderLeft: "4px solid var(--primary)",
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "12px", width: "100%", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
            <Search
              size={18}
              style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
            />
            <input
              type="text"
              placeholder="Search by college or area (e.g. Malla Reddy, Maisammaguda)..."
              className="form-input"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              style={{ paddingLeft: "46px", borderRadius: "12px" }}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: "0 24px", borderRadius: "12px", height: "46px" }}
          >
            Search PGs
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowFilters(!showFilters)}
            style={{
              padding: "0 16px",
              borderRadius: "12px",
              height: "46px",
              borderColor: showFilters ? "var(--primary)" : "var(--border-color)",
              color: showFilters ? "var(--primary)" : "var(--text-main)",
            }}
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>
        </form>

        {/* Suggested searches */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
            Popular Search:
          </span>
          <button
            onClick={() => handleQuickSearch("Malla Reddy University")}
            className="badge btn-secondary"
            style={{ border: "1px solid var(--border-color)", padding: "4px 10px", fontSize: "0.75rem", cursor: "pointer", background: "none" }}
          >
            Malla Reddy University
          </button>
          <button
            onClick={() => handleQuickSearch("Maisammaguda")}
            className="badge btn-secondary"
            style={{ border: "1px solid var(--border-color)", padding: "4px 10px", fontSize: "0.75rem", cursor: "pointer", background: "none" }}
          >
            Maisammaguda Area
          </button>
          <button
            onClick={() => handleQuickSearch("Women Hostel")}
            className="badge btn-secondary"
            style={{ border: "1px solid var(--border-color)", padding: "4px 10px", fontSize: "0.75rem", cursor: "pointer", background: "none" }}
          >
            Girls PG
          </button>
        </div>

        {/* Filter Drawer */}
        {showFilters && (
          <div
            className="animate-fade-in"
            style={{
              paddingTop: "20px",
              borderTop: "1px solid var(--border-color)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
            }}
          >
            {/* Rent Filter */}
            <div className="form-group">
              <label className="form-label" style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Max Monthly Budget</span>
                <span style={{ color: "var(--primary)", fontWeight: 700 }}>₹{maxRent.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min="3000"
                max="20000"
                step="500"
                value={maxRent}
                onChange={(e) => setMaxRent(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--primary)", cursor: "pointer" }}
              />
            </div>

            {/* Distance Filter */}
            <div className="form-group">
              <label className="form-label" style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Max Distance from College</span>
                <span style={{ color: "var(--primary)", fontWeight: 700 }}>{maxDistance} km</span>
              </label>
              <input
                type="range"
                min="0.2"
                max="10"
                step="0.1"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--primary)", cursor: "pointer" }}
              />
            </div>

            {/* Food Included */}
            <div className="form-group">
              <label className="form-label">Food Availability</label>
              <select
                className="form-input"
                value={reqFood}
                onChange={(e) => setReqFood(e.target.value)}
                style={{ borderRadius: "8px" }}
              >
                <option value="any">Show All (With or Without Food)</option>
                <option value="yes">Only Food Included (Mess/Meals)</option>
              </select>
            </div>

            {/* Transport Available */}
            <div className="form-group">
              <label className="form-label">Transport Available</label>
              <select
                className="form-input"
                value={reqTransport}
                onChange={(e) => setReqTransport(e.target.value)}
                style={{ borderRadius: "8px" }}
              >
                <option value="any">Show All (With or Without Transport)</option>
                <option value="yes">Only Transport Available</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Hostel Listings Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ color: "var(--text-muted)" }}>Loading registered PGs...</p>
        </div>
      ) : filteredHostels.length > 0 ? (
        <div className="grid-3">
          {filteredHostels.map((hostel) => {
            const minRent = getMinRent(hostel);
            return (
              <div
                key={hostel.id}
                className="glass glass-interactive"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                {/* Card Top Image */}
                <div style={{ height: "200px", width: "100%", background: "#e2e8f0", position: "relative" }}>
                  <img
                    src={
                      hostel.rooms && hostel.rooms.length > 0 && hostel.rooms[0].image_url
                        ? hostel.rooms[0].image_url
                        : "/images/hostel_lobby.png"
                    }
                    alt={hostel.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = "/images/hostel_lobby.png";
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "12px",
                      left: "12px",
                      background: "rgba(9, 9, 11, 0.75)",
                      color: "#fff",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontSize: "0.75rem",
                      backdropFilter: "blur(4px)",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <MapPin size={12} />
                    <span>{hostel.distance} km from college</span>
                  </div>
                </div>

                {/* Card Content */}
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", flexGrow: 1, gap: "12px" }}>
                  <div>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "4px" }}>{hostel.name}</h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Compass size={12} />
                      <span>{hostel.location}</span>
                    </p>
                  </div>

                  {/* Rent starting indicator */}
                  <div style={{ display: "flex", alignItems: "baseline", gap: "4px", margin: "4px 0" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Starts from</span>
                    <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--primary)" }}>
                      ₹{minRent.toLocaleString()}
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>/mo</span>
                  </div>

                  {/* Badges list */}
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {hostel.food === "Yes" && (
                      <span className="badge badge-success" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Utensils size={12} />
                        Food
                      </span>
                    )}
                    {hostel.transport === "Yes" && (
                      <span className="badge badge-success" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Bus size={12} />
                        Bus
                      </span>
                    )}
                    {(!hostel.rooms || hostel.rooms.length === 0) && (
                      <span className="badge badge-warning">No Rooms Configured</span>
                    )}
                  </div>

                  {/* Facilities list */}
                  {hostel.facilities && hostel.facilities.length > 0 && (
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", borderTop: "1px solid var(--border-color)", paddingTop: "10px" }}>
                      <span style={{ fontWeight: 700 }}>Amenities: </span>
                      {hostel.facilities.slice(0, 3).join(" • ")}
                      {hostel.facilities.length > 3 && ` +${hostel.facilities.length - 3} more`}
                    </div>
                  )}

                  {/* Card Action Button */}
                  <button
                    onClick={() => navigate(`/hostels/${hostel.id}`)}
                    className="btn btn-primary"
                    style={{
                      width: "100%",
                      borderRadius: "10px",
                      marginTop: "auto",
                      padding: "10px",
                      fontSize: "0.85rem",
                    }}
                  >
                    View Room Sharing Options
                    <ChevronRight size={16} />
                  </button>
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
          <AlertCircle size={40} style={{ color: "var(--warning)" }} />
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>No hostels found</h3>
          <p style={{ color: "var(--text-muted)", maxWidth: "400px", fontSize: "0.9rem" }}>
            We couldn't find any hostels matching your criteria or search text. Try adjusting your filters or quick-searching Malla Reddy.
          </p>
        </div>
      )}
    </div>
  );
}
