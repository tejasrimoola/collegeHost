import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2"; // Import MySQL library
import dotenv from "dotenv"; // Import dotenv

dotenv.config(); // Load environment variables from .env file

// Log environment variables to check if they are loaded correctly
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_NAME:", process.env.DB_NAME);

const app = express();
const PORT = process.env.PORT || 3000; // Use Render's provided port or fallback to 3000

// Middleware to parse URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files from the 'public' directory

// ✅ Use environment variables to connect to the database
const db = mysql.createConnection({
  host: process.env.DB_HOST,        // MySQL Host
  user: process.env.DB_USER,        // MySQL User
  password: process.env.DB_PASSWORD,// MySQL Password
  database: process.env.DB_NAME,    // MySQL Database Name
  port: process.env.DB_PORT,        // MySQL Port
  connectTimeout: 10000,            // Timeout for connecting to the database
});

// Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL database!");
});

// Serve homepage (contact form)
app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/public/contact.html");
});

// Serve registration form
app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/public/register.html");
});

// Handle registration form submission
app.post("/register", async (req, res) => {
  const { name, email, phone, course } = req.body;

  try {
    const [result] = await db.promise().query("SELECT * FROM students WHERE email = ?", [email]);
    
    if (result.length > 0) {
      return res.send("You are already registered with this email!");
    } else {
      await db.promise().query(
        "INSERT INTO students (name, email, phone, course) VALUES (?, ?, ?, ?)", 
        [name, email, phone, course]
      );
      res.send("Registration successful!");
    }
  } catch (err) {
    console.error("❌ Database error:", err);
    return res.status(500).send("An error occurred while processing your registration.");
  }
});

// Handle contact form submission
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await db.promise().query("INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)", [name, email, message]);
    res.send("Thank you for contacting us!");
  } catch (err) {
    console.error("❌ Error inserting data:", err);
    return res.status(500).send("An error occurred while submitting your message.");
  }
});

// Start the server (bind to 0.0.0.0 for hosting)
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Fix timeout issues for longer database queries
server.keepAliveTimeout = 120 * 1000;  // 2 minutes
server.headersTimeout = 120 * 1000;  // 2 minutes
