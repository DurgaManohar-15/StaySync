const mysql = require("mysql");
const bcrypt = require("bcryptjs");

const connectionConfig = {
  host: "localhost",
  user: "root",
  password: "8328291394",
  multipleStatements: true
};

const connection = mysql.createConnection(connectionConfig);

async function initialize() {
  console.log("Connecting to MySQL...");
  connection.connect(async (err) => {
    if (err) {
      console.error("❌ Failed to connect to MySQL. Is it running? Error:", err.message);
      process.exit(1);
    }
    console.log("✅ Connected to MySQL Server");

    // 1. Create Database
    connection.query("CREATE DATABASE IF NOT EXISTS stay_sync", async (err) => {
      if (err) {
        console.error("❌ Failed to create database:", err.message);
        connection.end();
        process.exit(1);
      }
      console.log("✅ Database 'stay_sync' created or already exists");

      // 2. Connect to database
      connection.query("USE stay_sync", async (err) => {
        if (err) {
          console.error("❌ Failed to select database:", err.message);
          connection.end();
          process.exit(1);
        }

        try {
          await dropTables();
          await createTables();
          await seedData();
          console.log("🎉 Database initialization completed successfully!");
        } catch (error) {
          console.error("❌ Initialization error:", error);
        } finally {
          connection.end();
        }
      });
    });
  });
}

function queryAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

async function dropTables() {
  console.log("Dropping existing tables to ensure clean schema alignment...");
  await queryAsync("DROP TABLE IF EXISTS bookings");
  await queryAsync("DROP TABLE IF EXISTS rooms");
  await queryAsync("DROP TABLE IF EXISTS hostels");
  await queryAsync("DROP TABLE IF EXISTS users");
  console.log("✅ Dropped old tables");
}

async function createTables() {
  console.log("Creating tables...");

  // Users Table
  await queryAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('student', 'admin') NOT NULL
    )
  `);
  console.log(" - 'users' table ready");

  // Hostels Table
  await queryAsync(`
    CREATE TABLE IF NOT EXISTS hostels (
      id INT AUTO_INCREMENT PRIMARY KEY,
      owner_id INT,
      name VARCHAR(200) NOT NULL,
      location VARCHAR(200) NOT NULL,
      address TEXT NOT NULL,
      facilities TEXT,
      transport VARCHAR(10) DEFAULT 'No',
      distance DECIMAL(5,2) DEFAULT 0.0,
      food VARCHAR(10) DEFAULT 'No',
      owner_name VARCHAR(100) NOT NULL,
      owner_email VARCHAR(100) NOT NULL,
      owner_mobile VARCHAR(20) NOT NULL,
      FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);
  console.log(" - 'hostels' table ready");

  // Rooms Table
  await queryAsync(`
    CREATE TABLE IF NOT EXISTS rooms (
      id INT AUTO_INCREMENT PRIMARY KEY,
      hostel_id INT NOT NULL,
      sharing_type INT NOT NULL, -- 1 = Single, 2 = Double, 3 = Triple, 4 = Quadruple
      rent DECIMAL(10,2) NOT NULL,
      available_beds INT DEFAULT 1,
      image_url VARCHAR(500),
      FOREIGN KEY (hostel_id) REFERENCES hostels(id) ON DELETE CASCADE
    )
  `);
  console.log(" - 'rooms' table ready");

  // Bookings Table
  await queryAsync(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT,
      student_name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      gender VARCHAR(20) NOT NULL,
      college_name VARCHAR(200) NOT NULL,
      hostel_id INT NOT NULL,
      hostel_name VARCHAR(200) NOT NULL,
      sharing_type INT NOT NULL,
      rent DECIMAL(10,2) NOT NULL,
      booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      check_in_date DATE NOT NULL,
      status VARCHAR(20) DEFAULT 'Pending',
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (hostel_id) REFERENCES hostels(id) ON DELETE CASCADE
    )
  `);
  console.log(" - 'bookings' table ready");
}

async function seedData() {
  console.log("Seeding initial data...");

  // Hash passwords
  const superadminPassword = await bcrypt.hash("superadmin123", 10);
  const studentPassword = await bcrypt.hash("student123", 10);
  const owner1Password = await bcrypt.hash("owner123", 10);
  const owner2Password = await bcrypt.hash("owner123", 10);

  // 1. Insert Users
  // Super admin (hidden under role 'admin', handles email superadmin@staysync.com)
  const superadminResult = await queryAsync(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    ["Super Admin", "superadmin@staysync.com", superadminPassword, "admin"]
  );

  // Owners
  const owner1Result = await queryAsync(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    ["Ramesh Kumar", "ramesh@hostels.com", owner1Password, "admin"]
  );

  const owner2Result = await queryAsync(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    ["Sita Reddy", "sita@pgfinder.com", owner2Password, "admin"]
  );

  // Students
  const student1Result = await queryAsync(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    ["Amit Verma", "amit@student.com", studentPassword, "student"]
  );
  
  const student2Result = await queryAsync(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    ["Pooja Patel", "pooja@student.com", studentPassword, "student"]
  );

  const owner1Id = owner1Result.insertId;
  const owner2Id = owner2Result.insertId;
  const student1Id = student1Result.insertId;
  const student2Id = student2Result.insertId;

  console.log(" - Seeded users");

  // 2. Insert Hostels
  const hostel1Result = await queryAsync(`
    INSERT INTO hostels (owner_id, name, location, address, facilities, transport, distance, food, owner_name, owner_email, owner_mobile)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    owner1Id,
    "Malla Reddy University Boys Hostel",
    "Malla Reddy University",
    "Maisammaguda, Dhulapally, Secunderabad, Telangana 500100",
    "WiFi, Delicious Food, Laundry, Hot Water, Gym, 24/7 Security",
    "Yes",
    0.4,
    "Yes",
    "Ramesh Kumar",
    "ramesh@hostels.com",
    "9876543210"
  ]);

  const hostel2Result = await queryAsync(`
    INSERT INTO hostels (owner_id, name, location, address, facilities, transport, distance, food, owner_name, owner_email, owner_mobile)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    owner1Id,
    "Divya Sai Executive Hostel",
    "Malla Reddy University",
    "Maisammaguda Lane 4, Secunderabad, Telangana 500100",
    "WiFi, Attached Bathroom, TV Room, Daily Cleaning, Power Backup",
    "No",
    0.9,
    "Yes",
    "Ramesh Kumar",
    "ramesh@hostels.com",
    "9876543210"
  ]);

  const hostel3Result = await queryAsync(`
    INSERT INTO hostels (owner_id, name, location, address, facilities, transport, distance, food, owner_name, owner_email, owner_mobile)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    owner2Id,
    "Shagun PG for Girls",
    "Malla Reddy College of Engineering for Women",
    "Maisammaguda Cross Roads, Secunderabad, Telangana 500100",
    "High-speed Internet, Homely Food, CC Cameras, AC Rooms, Wardrobes",
    "Yes",
    0.5,
    "Yes",
    "Sita Reddy",
    "sita@pgfinder.com",
    "8887776665"
  ]);

  const hostel1Id = hostel1Result.insertId;
  const hostel2Id = hostel2Result.insertId;
  const hostel3Id = hostel3Result.insertId;

  console.log(" - Seeded hostels");

  // 3. Insert Rooms
  // For Hostel 1 (Malla Reddy University Boys Hostel)
  // Single Sharing
  await queryAsync(
    "INSERT INTO rooms (hostel_id, sharing_type, rent, available_beds, image_url) VALUES (?, ?, ?, ?, ?)",
    [hostel1Id, 1, 12000.00, 3, "/images/single_room.jpg"]
  );
  // Double Sharing
  await queryAsync(
    "INSERT INTO rooms (hostel_id, sharing_type, rent, available_beds, image_url) VALUES (?, ?, ?, ?, ?)",
    [hostel1Id, 2, 8500.00, 8, "/images/double_room.jpg"]
  );
  // Triple Sharing
  await queryAsync(
    "INSERT INTO rooms (hostel_id, sharing_type, rent, available_beds, image_url) VALUES (?, ?, ?, ?, ?)",
    [hostel1Id, 3, 6500.00, 12, "/images/triple_room.jpg"]
  );

  // For Hostel 2 (Divya Sai Executive Hostel)
  // Double Sharing
  await queryAsync(
    "INSERT INTO rooms (hostel_id, sharing_type, rent, available_beds, image_url) VALUES (?, ?, ?, ?, ?)",
    [hostel2Id, 2, 7500.00, 5, "/images/double_room.jpg"]
  );
  // Quadruple Sharing
  await queryAsync(
    "INSERT INTO rooms (hostel_id, sharing_type, rent, available_beds, image_url) VALUES (?, ?, ?, ?, ?)",
    [hostel2Id, 4, 5000.00, 16, "/images/quad_room.jpg"]
  );

  // For Hostel 3 (Shagun PG for Girls)
  // Single Sharing
  await queryAsync(
    "INSERT INTO rooms (hostel_id, sharing_type, rent, available_beds, image_url) VALUES (?, ?, ?, ?, ?)",
    [hostel3Id, 1, 14000.00, 2, "/images/single_room.jpg"]
  );
  // Double Sharing
  await queryAsync(
    "INSERT INTO rooms (hostel_id, sharing_type, rent, available_beds, image_url) VALUES (?, ?, ?, ?, ?)",
    [hostel3Id, 2, 9500.00, 6, "/images/double_room.jpg"]
  );

  console.log(" - Seeded rooms");

  // 4. Insert Bookings
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  await queryAsync(`
    INSERT INTO bookings (student_id, student_name, email, phone, gender, college_name, hostel_id, hostel_name, sharing_type, rent, check_in_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    student1Id,
    "Amit Verma",
    "amit@student.com",
    "9988776655",
    "Male",
    "Malla Reddy University",
    hostel1Id,
    "Malla Reddy University Boys Hostel",
    2,
    8500.00,
    nextWeek.toISOString().slice(0, 10),
    "Pending"
  ]);

  await queryAsync(`
    INSERT INTO bookings (student_id, student_name, email, phone, gender, college_name, hostel_id, hostel_name, sharing_type, rent, check_in_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    student2Id,
    "Pooja Patel",
    "pooja@student.com",
    "9911223344",
    "Female",
    "Malla Reddy College of Engineering for Women",
    hostel3Id,
    "Shagun PG for Girls",
    1,
    14000.00,
    nextWeek.toISOString().slice(0, 10),
    "Approved"
  ]);

  console.log(" - Seeded bookings");
}

initialize();
