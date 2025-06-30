document.addEventListener("DOMContentLoaded", function () {
  let user = JSON.parse(sessionStorage.getItem("loggedInUser"));

  if (!user || user.role !== "student") {
    alert("Unauthorized Access!");
    window.location.href = "login.html";
    return;
  }

  // Hostel data mapping
  const hostelsData = {
    mallareddyuniversity: [
      "Malla Reddy University Boys Hostel",
      "Malla Reddy University Girls Hostel",
      "Divya Sai Executive and Hostel",
      "GB Raju Boys Hostel",
    ],
    mallareddyengineeringcollege: [
      "Malla Reddy Engineering College Boys Hostel",
      "Malla Reddy Engineering College Girls Hostel",
      "Divya Sai Executive and Hostel",
      "GB Raju Boys Hostel",
    ],
    mallareddycollegeofengineeringforwomen: [
      "Malla Reddy College of Engineering for Women Hostel",
      "Shagun PG for Girls",
      "Sri Sai Tulasi Girls Hostel",
    ],
    nallamallareddyengineeringcollege: [
      "Nalla Malla Reddy Engineering College Hostel",
      "Raghavendra Boys Comfort Home",
      "Venkata Sai Laxmi Boys Hostel",
    ],
    stpetersengineeringcollege: [
      "St. Peter's Engineering College Boys Hostel",
      "Karthikeya Boys Hostel",
      "PG for Boys in Maisammaguda",
    ],
  };

  function redirectToBooking(hostelName) {
    console.log("Selected Hostel:", hostelName);
    sessionStorage.setItem("selectedHostel", hostelName);
    window.location.href = "booking.html";
  }

  document.getElementById("search-btn").addEventListener("click", function () {
    let collegeName = document.getElementById("search-box").value.trim();
    let formattedCollegeName = collegeName.toLowerCase().replace(/\s+/g, "");

    console.log("Searching for:", formattedCollegeName);

    let searchResults = document.getElementById("search-results");
    searchResults.innerHTML = ""; // Clear previous results

    if (hostelsData[formattedCollegeName]) {
      let resultsContainer = document.createElement("div");
      resultsContainer.classList.add("results-container");

      hostelsData[formattedCollegeName].forEach((hostel) => {
        let hostelItem = document.createElement("div");
        hostelItem.classList.add("hostel-item");
        hostelItem.innerHTML = `
            <p><strong>${hostel}</strong></p>
            <button class="view-btn" data-hostel="${hostel}">View Details</button>
          `;
        resultsContainer.appendChild(hostelItem);
      });

      searchResults.appendChild(resultsContainer);

      document.querySelectorAll(".view-btn").forEach((button) => {
        button.addEventListener("click", function () {
          const hostelName = button.getAttribute("data-hostel");
          redirectToBooking(hostelName);
        });
      });
    } else {
      searchResults.innerHTML = "<p>No hostels found for this college.</p>";
    }
  });

  function loadBookingHistory() {
    let bookingList = document.getElementById("booking-list");
    bookingList.innerHTML = "";
    let bookings = JSON.parse(sessionStorage.getItem("userBookings")) || [];

    if (bookings.length === 0) {
      bookingList.innerHTML = "<li>No bookings found.</li>";
      return;
    }

    bookings.forEach((booking) => {
      let bookingItem = document.createElement("li");
      bookingItem.textContent = `${booking.hostel} - ${booking.name} - ${booking.checkInDate}`;
      bookingList.appendChild(bookingItem);
    });
  }

  loadBookingHistory();
});
