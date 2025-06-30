document.addEventListener("DOMContentLoaded", function () {
  // Load stored users (simulate fetching from users.js)
  let storedUsers = JSON.parse(localStorage.getItem("users")) || [];

  // Handle Signup
  document
    .getElementById("signupForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      let username = document.getElementById("signupUsername").value;
      let email = document.getElementById("signupEmail").value;
      let password = document.getElementById("signupPassword").value;
      let role = document.getElementById("signupRole").value;

      // Check if user already exists
      if (storedUsers.some((user) => user.email === email)) {
        alert("User already exists! Please login.");
        return;
      }

      // Add user to localStorage
      storedUsers.push({ username, email, password, role });
      localStorage.setItem("users", JSON.stringify(storedUsers));

      alert("Signup successful! You can now log in.");
      document.getElementById("loginBtn").click(); // Switch to login tab
    });

  // Handle Login
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    // Find user in stored users
    let user = storedUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      alert("Login successful!");

      // Store logged-in user in sessionStorage
      sessionStorage.setItem("loggedInUser", JSON.stringify(user));

      // Redirect to correct dashboard
      if (user.role === "admin") {
        window.location.href = "admin-dashboard.html";
      } else {
        window.location.href = "student-dashboard.html";
      }
    } else {
      alert("Invalid email or password!");
    }
  });
});
