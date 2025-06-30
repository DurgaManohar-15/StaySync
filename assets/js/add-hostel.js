document
  .getElementById("hostel-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from submitting the traditional way

    // Get logged-in admin username (stored in sessionStorage during login)
    let loggedInAdmin = sessionStorage.getItem("adminUser");

    if (!loggedInAdmin) {
      alert("Unauthorized! Please log in.");
      window.location.href = "login.html";
      return;
    }

    // Get form values
    let hostel = {
      name: document.getElementById("hostel-name").value,
      location: document.getElementById("location").value,
      rent: document.getElementById("rent").value,
      food: document.getElementById("food").value,
      distance: document.getElementById("distance").value,
      addedBy: loggedInAdmin, // Store the admin who added this hostel
    };

    // Retrieve existing hostels from localStorage
    let hostels = JSON.parse(localStorage.getItem("hostels")) || [];

    // Add new hostel to array
    hostels.push(hostel);

    // Save updated list back to localStorage
    localStorage.setItem("hostels", JSON.stringify(hostels));

    // Redirect back to Admin Dashboard
    window.location.href = "admin-dashboard.html";
  });
