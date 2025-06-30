document.addEventListener("DOMContentLoaded", function () {
  const hostelList = document.getElementById("hostel-list");

  let hostels = JSON.parse(localStorage.getItem("hostels")) || [];
  let loggedInAdmin = sessionStorage.getItem("adminUser");

  if (!loggedInAdmin) {
    alert("Unauthorized! Please log in.");
    window.location.href = "login.html";
    return;
  }

  function displayHostels() {
    hostelList.innerHTML = "";

    // Filter hostels added by the logged-in admin
    let filteredHostels = hostels.filter(
      (hostel) => hostel.addedBy === loggedInAdmin
    );

    if (filteredHostels.length === 0) {
      hostelList.innerHTML = `<tr><td colspan="5">No hostels added yet.</td></tr>`;
      return;
    }

    filteredHostels.forEach((hostel) => {
      let row = document.createElement("tr");
      row.innerHTML = `
              <td>${hostel.name}</td>
              <td>${hostel.location}</td>
              <td>${hostel.rent}</td>
              <td>${hostel.food}</td>
              <td>${hostel.distance} km</td>
          `;
      hostelList.appendChild(row);
    });
  }
  sessionStorage.setItem("adminUser", username);
  localStorage.setItem("loggedInAdmin", username);

  displayHostels();
});
