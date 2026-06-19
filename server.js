const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require("path");
const nodemailer = require("nodemailer");
const db = require("./db");

const app = express();
app.use(express.json());
app.use(cors());

// Serve static React files in production
app.use(express.static(path.join(__dirname, "frontend/dist")));

// ==========================================
// NODEMAILER EMAIL ENGINE
// ==========================================
let transporter;

async function initMailer() {
  // Support custom email configuration via environment variables
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log("✅ Nodemailer configured using Gmail SMTP");
  } else {
    try {
      // Fallback: Create Ethereal Test Account
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log("ℹ️ Nodemailer configured using Ethereal Test Account");
    } catch (err) {
      console.error("❌ Failed to initialize Ethereal nodemailer test account:", err.message);
    }
  }
}
initMailer();

// Notification 1: Email Owner when a booking is created
function sendBookingNotificationToOwner(booking) {
  if (!transporter) {
    console.log("⚠️ Nodemailer transporter not initialized. Skipping email alert.");
    return;
  }

  // Get owner details from the database
  db.query("SELECT owner_email, owner_name FROM hostels WHERE id = ?", [booking.hostel_id], (err, results) => {
    if (err || results.length === 0) {
      console.error("❌ Failed to find owner details for booking email alert.");
      return;
    }

    const { owner_email, owner_name } = results[0];
    const sharingText = booking.sharing_type === 1 ? "Single Room" : `${booking.sharing_type}-Sharing`;

    const mailOptions = {
      from: '"STAY SYNC Alerts" <no-reply@staysync.com>',
      to: owner_email,
      subject: `🔔 New Booking Request: ${booking.student_name} - ${booking.hostel_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; line-height: 1.5;">
          <h2 style="color: #4f46e5; margin-bottom: 20px; font-family: 'Outfit', sans-serif;">New Booking Request Received</h2>
          <p>Dear <strong>${owner_name}</strong>,</p>
          <p>A student has placed a booking reservation for your property, <strong>${booking.hostel_name}</strong>. Here are the booking details:</p>
          
          <div style="background-color: #f8fafc; padding: 18px; border-radius: 10px; border: 1px solid #f1f5f9; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; color: #64748b; font-size: 0.9rem; width: 140px;">Student Name:</td><td style="font-weight: 700; color: #0f172a;">${booking.student_name}</td></tr>
              <tr><td style="padding: 6px 0; color: #64748b; font-size: 0.9rem;">Email Address:</td><td style="color: #0f172a;">${booking.email}</td></tr>
              <tr><td style="padding: 6px 0; color: #64748b; font-size: 0.9rem;">Mobile Number:</td><td style="font-weight: 600; color: #0f172a;">+91 ${booking.phone}</td></tr>
              <tr><td style="padding: 6px 0; color: #64748b; font-size: 0.9rem;">Gender:</td><td style="text-transform: capitalize; color: #0f172a;">${booking.gender}</td></tr>
              <tr><td style="padding: 6px 0; color: #64748b; font-size: 0.9rem;">College:</td><td style="color: #0f172a;">${booking.college_name}</td></tr>
              <tr><td style="padding: 6px 0; color: #64748b; font-size: 0.9rem;">Sharing Option:</td><td style="font-weight: 700; color: #6366f1;">${sharingText}</td></tr>
              <tr><td style="padding: 6px 0; color: #64748b; font-size: 0.9rem;">Monthly Rent:</td><td style="font-weight: 700; color: #6366f1;">₹${Number(booking.rent).toLocaleString()}</td></tr>
              <tr><td style="padding: 6px 0; color: #64748b; font-size: 0.9rem;">Check-in Date:</td><td style="font-weight: 600; color: #0f172a;">${booking.check_in_date}</td></tr>
            </table>
          </div>

          <p>Please log in to the STAY SYNC admin dashboard to accept or decline this reservation request.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
          <p style="font-size: 0.75rem; color: #94a3b8; text-align: center;">This is an automated notification from STAY SYNC. Please do not reply directly to this email.</p>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Nodemailer booking email delivery failed:", error.message);
      } else {
        console.log(`✅ Nodemailer booking notification sent to owner (${owner_email})`);
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
          console.log("✉️ Preview the sent Booking Alert email here: %s", previewUrl);
        }
      }
    });
  });
}

// Notification 2: Email Students in location details when a new PG is registered
function sendNewPGNotificationToStudents(hostel) {
  if (!transporter) {
    console.log("⚠️ Nodemailer transporter not initialized. Skipping email alert.");
    return;
  }

  const queryLoc = `%${hostel.location.trim().toLowerCase()}%`;
  
  // 1. Fetch students who have registered bookings near this college/location
  db.query("SELECT DISTINCT email, student_name AS name FROM bookings WHERE LOWER(college_name) LIKE ?", [queryLoc], (err, bookedStudents) => {
    let targetStudents = [];
    if (!err && bookedStudents.length > 0) {
      targetStudents = bookedStudents;
    }

    // 2. Fetch all student users from database to match or notify generally
    db.query("SELECT name, email FROM users WHERE role = 'student'", (err, studentUsers) => {
      if (!err && studentUsers.length > 0) {
        const studentMap = {};
        // Add direct matches first
        targetStudents.forEach(s => studentMap[s.email] = s.name);
        
        // Add other students as general alerts (up to 5) to ensure dispatch works in demo environment
        studentUsers.forEach(s => {
          if (s.email.toLowerCase().includes(hostel.location.toLowerCase()) || Object.keys(studentMap).length < 5) {
            studentMap[s.email] = s.name;
          }
        });

        targetStudents = Object.keys(studentMap).map(email => ({ email, name: studentMap[email] }));
      }

      if (targetStudents.length === 0) {
        console.log("ℹ️ No registered students found to notify for college:", hostel.location);
        return;
      }

      console.log(`✉️ Dispatching new PG alerts to ${targetStudents.length} students...`);

      targetStudents.forEach((student) => {
        const mailOptions = {
          from: '"STAY SYNC Alerts" <no-reply@staysync.com>',
          to: student.email,
          subject: `✨ New Hostel Alert: Live near ${hostel.location} at ${hostel.name}!`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; line-height: 1.5;">
              <h2 style="color: #10b981; margin-bottom: 20px; font-family: 'Outfit', sans-serif;">New PG Listing Registered!</h2>
              <p>Dear <strong>${student.name}</strong>,</p>
              <p>A brand new accommodation has just been listed near your institution, <strong>${hostel.location}</strong>!</p>
              
              <div style="background-color: #f0fdf4; padding: 18px; border-radius: 10px; border: 1px solid #bbf7d0; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #15803d; font-size: 1.2rem;">${hostel.name}</h3>
                <p style="margin: 8px 0; color: #1f2937;"><strong>📍 Location:</strong> ${hostel.address}</p>
                <p style="margin: 8px 0; color: #1f2937;"><strong>🚶 Proximity:</strong> ${hostel.distance} km from college</p>
                <p style="margin: 8px 0; color: #1f2937;"><strong>🍳 Food Available:</strong> ${hostel.food}</p>
                <p style="margin: 8px 0; color: #1f2937;"><strong>🚌 Transport Available:</strong> ${hostel.transport}</p>
                <p style="margin: 8px 0; color: #1f2937;"><strong>✨ Amenities:</strong> ${hostel.facilities}</p>
              </div>

              <p>Log in to STAY SYNC now to check out the details, browse photos of the single/double room sharing layouts, and submit your reservation request!</p>
              <a href="http://localhost:5173/auth" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px; text-align: center;">Find PG Room Now</a>
              
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
              <p style="font-size: 0.75rem; color: #94a3b8; text-align: center;">You received this because you are a registered student on STAY SYNC.</p>
            </div>
          `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(`❌ Failed to alert student (${student.email}):`, error.message);
          } else {
            console.log(`✅ New PG email alert sent to student (${student.email})`);
            const previewUrl = nodemailer.getTestMessageUrl(info);
            if (previewUrl) {
              console.log(`✉️ Preview PG Alert email for ${student.email}: %s`, previewUrl);
            }
          }
        });
      });
    });
  });
}

// ==========================================
// AUTHENTICATION APIs
// ==========================================

// Signup Route
app.post("/api/auth/signup", async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [username, email, hashedPassword, role], (err, result) => {
      if (err) {
        console.error("❌ Signup database error:", err);
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ error: "Email or username is already registered" });
        }
        return res.status(500).json({ error: "Database signup failed" });
      }
      res.status(201).json({ message: "✅ Signup successful! Please log in." });
    });
  } catch (error) {
    console.error("❌ Hash error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Login Route (Supports username OR email)
app.post("/api/auth/login", (req, res) => {
  const { email, password, role } = req.body; // email represents either username or email input
  if (!email || !password || !role) {
    return res.status(400).json({ error: "Email/Username, password and role are required" });
  }

  // SQL checks both email OR name (username) columns
  const sql = "SELECT * FROM users WHERE (email = ? OR name = ?) AND role = ?";
  db.query(sql, [email, email, role], async (err, results) => {
    if (err) {
      console.error("❌ Login query error:", err);
      return res.status(500).json({ error: "Database authentication failed" });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid username/email, password, or role choice." });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username/email, password, or role choice." });
    }

    // Hide password in response
    delete user.password;

    res.status(200).json({
      message: "✅ Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isSuperAdmin: user.email === "superadmin@staysync.com"
      }
    });
  });
});

// Google Login / Signup Route
app.post("/api/auth/google-login", async (req, res) => {
  const { email, name, role, action } = req.body; // action: 'login' or 'signup'
  if (!email || !name || !role || !action) {
    return res.status(400).json({ error: "Email, name, role and action are required" });
  }

  // Check if user already exists
  const sqlCheck = "SELECT * FROM users WHERE email = ?";
  db.query(sqlCheck, [email], async (err, results) => {
    if (err) {
      console.error("❌ Google login query error:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (action === "login") {
      if (results.length === 0) {
        return res.status(401).json({ error: "This Google account is not registered on STAY SYNC. Please sign up first." });
      }

      const user = results[0];
      if (user.role !== role) {
        return res.status(400).json({ error: `This Google account is registered as a ${user.role}, not a ${role}.` });
      }

      // Hide password
      delete user.password;
      return res.status(200).json({
        message: "✅ Google login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isSuperAdmin: user.email === "superadmin@staysync.com"
        }
      });
    } else {
      // Sign Up Action
      if (results.length > 0) {
        return res.status(400).json({ error: "This Google account is already registered. Please log in instead." });
      }

      try {
        const placeholderPassword = await bcrypt.hash("google_auth_placeholder_" + Math.random(), 10);
        const sqlInsert = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
        
        db.query(sqlInsert, [name, email, placeholderPassword, role], (err, insertResult) => {
          if (err) {
            console.error("❌ Google signup failed:", err);
            return res.status(500).json({ error: "Failed to register Google user" });
          }

          res.status(201).json({
            message: "✅ Google account registered and logged in successfully!",
            user: {
              id: insertResult.insertId,
              name: name,
              email: email,
              role: role,
              isSuperAdmin: email === "superadmin@staysync.com"
            }
          });
        });
      } catch (hashErr) {
        console.error("❌ Google auth hash error:", hashErr);
        res.status(500).json({ error: "Server error" });
      }
    }
  });
});

// ==========================================
// HOSTEL & ROOM APIs
// ==========================================

// Get Hostels (Handles student search/filtering, owner filter, and superadmin view)
app.get("/api/hostels", (req, res) => {
  const { search, ownerEmail, userRole } = req.query;

  let sql = `
    SELECT 
      h.*, 
      r.id AS room_id, 
      r.sharing_type, 
      r.rent AS room_rent, 
      r.available_beds, 
      r.image_url AS room_image
    FROM hostels h 
    LEFT JOIN rooms r ON h.id = r.hostel_id
  `;
  
  let queryParams = [];

  // Scoping queries
  if (userRole === "admin") {
    if (ownerEmail === "superadmin@staysync.com") {
      // Super admin sees all, do not add filter
    } else {
      // Standard owner sees their own hostels
      sql += " WHERE h.owner_email = ?";
      queryParams.push(ownerEmail);
    }
  } else if (search) {
    // Students searching by location/college
    sql += " WHERE LOWER(h.location) LIKE ? OR LOWER(h.name) LIKE ?";
    const matchStr = `%${search.trim().toLowerCase()}%`;
    queryParams.push(matchStr, matchStr);
  }

  db.query(sql, queryParams, (err, results) => {
    if (err) {
      console.error("❌ Fetch hostels error:", err);
      return res.status(500).json({ error: "Failed to fetch hostels" });
    }

    // Process and group flat rows into nested hostel objects
    const hostelsMap = {};
    results.forEach((row) => {
      if (!hostelsMap[row.id]) {
        hostelsMap[row.id] = {
          id: row.id,
          owner_id: row.owner_id,
          name: row.name,
          location: row.location,
          address: row.address,
          facilities: row.facilities ? row.facilities.split(",").map(f => f.trim()) : [],
          transport: row.transport,
          distance: row.distance,
          food: row.food,
          owner_name: row.owner_name,
          owner_email: row.owner_email,
          owner_mobile: row.owner_mobile,
          rooms: []
        };
      }

      if (row.room_id) {
        hostelsMap[row.id].rooms.push({
          id: row.room_id,
          sharing_type: row.sharing_type,
          rent: row.room_rent,
          available_beds: row.available_beds,
          image_url: row.room_image
        });
      }
    });

    const hostelsList = Object.values(hostelsMap);
    res.status(200).json(hostelsList);
  });
});

// Add Hostel (restricted to owners)
app.post("/api/hostels", (req, res) => {
  const {
    owner_id,
    name,
    location,
    address,
    facilities,
    transport,
    distance,
    food,
    owner_name,
    owner_email,
    owner_mobile,
    rooms
  } = req.body;

  if (!name || !location || !address || !owner_name || !owner_email || !owner_mobile) {
    return res.status(400).json({ error: "Required fields are missing" });
  }

  const sqlHostel = `
    INSERT INTO hostels (owner_id, name, location, address, facilities, transport, distance, food, owner_name, owner_email, owner_mobile) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const hostelParams = [
    owner_id || null,
    name,
    location,
    address,
    facilities || "",
    transport || "No",
    distance || 0.0,
    food || "No",
    owner_name,
    owner_email,
    owner_mobile
  ];

  db.query(sqlHostel, hostelParams, (err, result) => {
    if (err) {
      console.error("❌ Add hostel query failed:", err);
      return res.status(500).json({ error: "Failed to add hostel" });
    }

    const hostelId = result.insertId;
    const addedHostelDetails = {
      id: hostelId,
      name,
      location,
      address,
      facilities: facilities || "WiFi, Security",
      transport: transport || "No",
      distance: distance || 0.0,
      food: food || "No",
      owner_name,
      owner_email
    };

    if (rooms && Array.isArray(rooms) && rooms.length > 0) {
      const roomValues = rooms.map((r) => [
        hostelId,
        r.sharing_type,
        r.rent,
        r.available_beds,
        r.image_url || "/images/double_room.jpg"
      ]);

      const sqlRooms = `
        INSERT INTO rooms (hostel_id, sharing_type, rent, available_beds, image_url) 
        VALUES ?
      `;

      db.query(sqlRooms, [roomValues], (err) => {
        if (err) {
          console.error("❌ Add rooms query failed:", err);
          return res.status(500).json({ error: "Hostel added, but rooms configuration failed" });
        }
        res.status(200).json({ message: "✅ Hostel and rooms added successfully!", hostelId });
        
        // Dispatch alerts to nearby students in the background
        sendNewPGNotificationToStudents(addedHostelDetails);
      });
    } else {
      res.status(200).json({ message: "✅ Hostel added successfully (no rooms configuration)!", hostelId });
      
      // Dispatch alerts to nearby students in the background
      sendNewPGNotificationToStudents(addedHostelDetails);
    }
  });
});

// Delete Hostel
app.delete("/api/hostels/:id", (req, res) => {
  const sql = "DELETE FROM hostels WHERE id = ?";
  db.query(sql, [req.params.id], (err) => {
    if (err) {
      console.error("❌ Delete hostel failed:", err);
      return res.status(500).json({ error: "Failed to delete hostel" });
    }
    res.status(200).json({ message: "✅ Hostel deleted successfully!" });
  });
});

// ==========================================
// BOOKING APIs
// ==========================================

// Create Booking
app.post("/api/bookings", (req, res) => {
  const {
    student_id,
    student_name,
    email,
    phone,
    gender,
    college_name,
    hostel_id,
    hostel_name,
    sharing_type,
    rent,
    check_in_date
  } = req.body;

  if (!student_name || !email || !phone || !gender || !college_name || !hostel_id || !hostel_name || !sharing_type || !rent || !check_in_date) {
    return res.status(400).json({ error: "All booking details are required" });
  }

  const sql = `
    INSERT INTO bookings (student_id, student_name, email, phone, gender, college_name, hostel_id, hostel_name, sharing_type, rent, check_in_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
  `;

  const params = [
    student_id || null,
    student_name,
    email,
    phone,
    gender,
    college_name,
    hostel_id,
    hostel_name,
    sharing_type,
    rent,
    check_in_date
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("❌ Booking creation error:", err);
      return res.status(500).json({ error: "Failed to book hostel" });
    }
    
    const bookingDetails = {
      id: result.insertId,
      student_id,
      student_name,
      email,
      phone,
      gender,
      college_name,
      hostel_id,
      hostel_name,
      sharing_type,
      rent,
      check_in_date
    };

    res.status(200).json({ message: "✅ Booking requested successfully! Under owner review." });

    // Send email alert to hostel owner in the background
    sendBookingNotificationToOwner(bookingDetails);
  });
});

// Get Bookings (Scoped depending on role)
app.get("/api/bookings", (req, res) => {
  const { email, role } = req.query;

  if (!email || !role) {
    return res.status(400).json({ error: "Email and role are required query parameters" });
  }

  let sql = "";
  let params = [];

  if (role === "student") {
    sql = "SELECT * FROM bookings WHERE email = ? ORDER BY booking_date DESC";
    params = [email];
  } else if (role === "admin") {
    if (email === "superadmin@staysync.com") {
      sql = "SELECT * FROM bookings ORDER BY booking_date DESC";
    } else {
      // Fetch bookings for hostels owned by this admin
      sql = `
        SELECT b.* 
        FROM bookings b
        JOIN hostels h ON b.hostel_id = h.id
        WHERE h.owner_email = ?
        ORDER BY b.booking_date DESC
      `;
      params = [email];
    }
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("❌ Fetch bookings error:", err);
      return res.status(500).json({ error: "Failed to fetch bookings" });
    }
    res.status(200).json(results);
  });
});

// Update Booking Status (e.g. Approve/Cancel)
app.patch("/api/bookings/:id", (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  const sql = "UPDATE bookings SET status = ? WHERE id = ?";
  db.query(sql, [status, req.params.id], (err) => {
    if (err) {
      console.error("❌ Update booking status failed:", err);
      return res.status(500).json({ error: "Failed to update booking status" });
    }
    res.status(200).json({ message: `✅ Booking status updated to '${status}' successfully!` });
  });
});

// ==========================================
// USER MONITORING APIs (Super Admin Only)
// ==========================================

// Get All Users (Excludes the super admin itself)
app.get("/api/users", (req, res) => {
  const sql = "SELECT id, name, email, role FROM users WHERE email != 'superadmin@staysync.com'";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Fetch users failed:", err);
      return res.status(500).json({ error: "Failed to fetch registered users" });
    }
    res.status(200).json(results);
  });
});

// Delete User
app.delete("/api/users/:id", (req, res) => {
  const sql = "DELETE FROM users WHERE id = ?";
  db.query(sql, [req.params.id], (err) => {
    if (err) {
      console.error("❌ Delete user failed:", err);
      return res.status(500).json({ error: "Failed to delete user" });
    }
    res.status(200).json({ message: "✅ User deleted successfully from the platform!" });
  });
});

// Fallback: serve React build client files
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 STAY SYNC Server running on http://localhost:${PORT}`);
});
