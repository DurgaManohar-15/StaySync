const users = [
  {
    username: "admin1",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
  {
    username: "student1",
    email: "student@example.com",
    password: "student123",
    role: "student",
  },
];

// Function to add a new user (for signup)
function addUser(username, email, password, role) {
  users.push({ username, email, password, role });
}

// Function to authenticate user (for login)
function authenticateUser(email, password) {
  return users.find(
    (user) => user.email === email && user.password === password
  );
}

// Export functions for use in other scripts
if (typeof module !== "undefined") {
  module.exports = { users, addUser, authenticateUser };
}
