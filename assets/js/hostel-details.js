document.addEventListener("DOMContentLoaded", function () {
  const hostelNameEl = document.getElementById("hostel-name");
  const hostelLocationEl = document.getElementById("hostel-location");
  const hostelRentEl = document.getElementById("hostel-rent");
  const hostelImageEl = document.getElementById("hostel-image");
  const amenitiesListEl = document.getElementById("amenities-list");
  const ownerNameEl = document.getElementById("owner-name");
  const ownerPhoneEl = document.getElementById("owner-phone");
  const googleMapEl = document.getElementById("google-map");

  // Sample Hostel Data (Replace with backend API)
  const hostelData = {
    name: "Sunrise Hostel",
    location: "Maisammaguda, Hyderabad",
    rent: "₹5000/month",
    image: "assets/images/sunrise-hostel.jpg",
    amenities: ["WiFi", "Mess Facility", "Laundry", "24/7 Security"],
    owner: {
      name: "Rahul Sharma",
      phone: "+91 9876543210",
    },
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1dxyz...YOUR_GOOGLE_MAPS_LINK_HERE...",
  };

  // Load Hostel Data
  hostelNameEl.textContent = hostelData.name;
  hostelLocationEl.textContent = `📍 ${hostelData.location}`;
  hostelRentEl.textContent = `💰 ${hostelData.rent}`;
  hostelImageEl.src = hostelData.image;

  // Load Amenities
  hostelData.amenities.forEach((amenity) => {
    let listItem = document.createElement("li");
    listItem.textContent = `✔️ ${amenity}`;
    amenitiesListEl.appendChild(listItem);
  });

  // Load Contact Info
  ownerNameEl.textContent = `👤 Owner: ${hostelData.owner.name}`;
  ownerPhoneEl.textContent = `📞 Contact: ${hostelData.owner.phone}`;

  // Load Google Map
  googleMapEl.src = hostelData.mapLink;

  // Book Now Button
  document.getElementById("book-btn").addEventListener("click", function () {
    alert("Booking feature coming soon!");
  });
});
