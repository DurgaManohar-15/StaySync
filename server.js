/* const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "8328291394",
  database: "stay_sync",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    return;
  }
  console.log("✅ Connected to MySQL Database");
});

// Serve Login Page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Signup Route
app.post("/signup", async (req, res) => {
  const { username, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql =
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
  db.query(sql, [username, email, hashedPassword, role], (err, result) => {
    if (err) {
      console.error("❌ Signup error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json({ message: "✅ Signup successful" });
  });
});

// Login Route
app.post("/login", (req, res) => {
  const { email, password, role } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND role = ?";
  db.query(sql, [email, role], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0)
      return res.status(401).json({ error: "Invalid credentials" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const redirectUrl =
      role === "admin" ? "/admin-dashboard.html" : "/student-dashboard.html";
    res
      .status(200)
      .json({ message: "✅ Login successful", redirect: redirectUrl });
  });
});

// ✅ Add Hostel Route
app.post("/add-hostel", (req, res) => {
  const {
    name,
    location,
    rent,
    food,
    distance,
    ownerName,
    ownerEmail,
    ownerMobile,
  } = req.body;
  const sql = `INSERT INTO hostels (name, location, rent, food, distance, owner_name, owner_email, owner_mobile) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [name, location, rent, food, distance, ownerName, ownerEmail, ownerMobile],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Failed to add hostel" });
      res.status(200).json({ message: "✅ Hostel added successfully!" });
    }
  );
});

// ✅ Fetch Registered Hostels
app.get("/fetch-hostels", (req, res) => {
  const sql = "SELECT * FROM hostels";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch hostels" });
    res.status(200).json(results);
  });
});

// ✅ Delete Hostel
app.delete("/delete-hostel/:id", (req, res) => {
  const sql = "DELETE FROM hostels WHERE id = ?";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: "Failed to delete hostel" });
    res.status(200).json({ message: "✅ Hostel deleted successfully!" });
  });
});

// ✅ Booking Route
app.post("/book-hostel", (req, res) => {
  const { studentName, email, hostelName, checkInDate } = req.body;
  const sql =
    "INSERT INTO bookings (student_name, email, hostel_name, check_in_date) VALUES (?, ?, ?, ?)";

  db.query(
    sql,
    [studentName, email, hostelName, checkInDate],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Failed to book hostel" });
      res.status(200).json({ message: "✅ Booking confirmed!" });
    }
  );
});

// ✅ Fetch Student Booking History
app.get("/fetch-bookings/:email", (req, res) => {
  const sql = "SELECT * FROM bookings WHERE email = ?";
  db.query(sql, [req.params.email], (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch bookings" });
    res.status(200).json(results);
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
 */

const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "8328291394",
  database: "stay_sync",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    return;
  }
  console.log("✅ Connected to MySQL Database");
});

// Serve Login Page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Signup Route
/* app.post("/signup", async (req, res) => {
  const { username, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql =
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
  db.query(sql, [username, email, hashedPassword, role], (err, result) => {
    if (err) {
      console.error("❌ Signup error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json({ message: "✅ Signup successful" });
  });
}); */

app.post("/signup", async (req, res) => {
  const { username, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql =
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
  db.query(sql, [username, email, hashedPassword, role], (err, result) => {
    if (err) {
      console.error("❌ Signup error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json({ message: "✅ Signup successful" });
  });
});

// Login Route
app.post("/login", (req, res) => {
  const { email, password, role } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND role = ?";
  db.query(sql, [email, role], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0)
      return res.status(401).json({ error: "Invalid credentials" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const redirectUrl =
      role === "admin" ? "/admin-dashboard.html" : "/student-dashboard.html";
    res
      .status(200)
      .json({ message: "✅ Login successful", redirect: redirectUrl });
  });
});

// ✅ Add Hostel Route
app.post("/add-hostel", (req, res) => {
  const {
    name,
    location,
    rent,
    food,
    distance,
    ownerName,
    ownerEmail,
    ownerMobile,
  } = req.body;
  const sql = `INSERT INTO hostels (name, location, rent, food, distance, owner_name, owner_email, owner_mobile) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [name, location, rent, food, distance, ownerName, ownerEmail, ownerMobile],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Failed to add hostel" });
      res.status(200).json({ message: "✅ Hostel added successfully!" });
    }
  );
});

/* // ✅ Fetch Registered Hostels
app.get("/fetch-hostels", (req, res) => {
  const sql = "SELECT * FROM hostels";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch hostels" });
    res.status(200).json(results);
  });
}); */

// ✅ Fetch hostels filtered by location
app.get("/fetch-hostels", (req, res) => {
  let location = req.query.location || "";
  let sql = "SELECT * FROM hostels WHERE LOWER(location) LIKE ?";

  db.query(sql, [`%${location}%`], (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch hostels" });
    res.status(200).json(results);
  });
});

// ✅ Delete Hostel
app.delete("/delete-hostel/:id", (req, res) => {
  const sql = "DELETE FROM hostels WHERE id = ?";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: "Failed to delete hostel" });
    res.status(200).json({ message: "✅ Hostel deleted successfully!" });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
