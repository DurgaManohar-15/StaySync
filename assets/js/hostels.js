document.addEventListener("DOMContentLoaded", function () {
  const hostelList = document.getElementById("hostel-list");
  const searchBox = document.getElementById("search-box");

  // Sample Hostel Data (Replace with backend API)
  const hostels = [
    {
      name: "Sunrise Hostel",
      location: "Maisammaguda",
      rent: "₹5000/month",
      image: "assets/images/sunrise-hostel.jpg",
    },
    {
      name: "Blue Nest Hostel",
      location: "Hyderabad",
      rent: "₹5500/month",
      image: "assets/images/blue-nest.jpg",
    },
    {
      name: "Green Stay Hostel",
      location: "Osmania University",
      rent: "₹6000/month",
      image: "assets/images/green-stay.jpg",
    },
  ];

  function displayHostels(filter = "") {
    hostelList.innerHTML = "";

    const filteredHostels = hostels.filter(
      (hostel) =>
        hostel.name.toLowerCase().includes(filter.toLowerCase()) ||
        hostel.location.toLowerCase().includes(filter.toLowerCase())
    );

    if (filteredHostels.length === 0) {
      hostelList.innerHTML = "<p>No hostels found</p>";
      return;
    }

    filteredHostels.forEach((hostel) => {
      let hostelCard = document.createElement("div");
      hostelCard.classList.add("hostel-card");

      hostelCard.innerHTML = `
        <img src="${hostel.image}" alt="${hostel.name}">
        <div class="hostel-name">${hostel.name}</div>
        <div class="hostel-details">${hostel.location}</div>
        <div class="hostel-details">${hostel.rent}</div>
        <button class="book-btn">Book Now</button>
      `;

      hostelList.appendChild(hostelCard);
    });
  }

  searchBox.addEventListener("input", function () {
    displayHostels(searchBox.value);
  });

  displayHostels();
});
