import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2";

const app = express();
const PORT = process.env.PORT || 10000; // Use Render's provided port or fallback to 10000

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// ✅ Update database configuration for deployment
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost", // Use an external database in production
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "teju1120", 
  database: process.env.DB_NAME || "college"
});

// ✅ Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database!");
});

// ✅ Serve homepage
app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/public/contact.html");
});

// ✅ Serve registration form
app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/public/register.html");
});

// ✅ Handle registration form submission
app.post("/register", (req, res) => {
  const { name, email, phone, course } = req.body;

  const checkSql = "SELECT * FROM students WHERE email = ?";
  db.query(checkSql, [email], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("An error occurred while checking your registration.");
    }

    if (result.length > 0) {
      return res.send("You are already registered with this email!");
    } else {
      const insertSql = "INSERT INTO students (name, email, phone, course) VALUES (?, ?, ?, ?)";
      db.query(insertSql, [name, email, phone, course], (err) => {
        if (err) {
          console.error("Error inserting data:", err);
          return res.status(500).send("An error occurred while processing your registration.");
        }
        res.send("Registration successful!");
      });
    }
  });
});

// ✅ Handle contact form submission
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;
  
  const sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
  db.query(sql, [name, email, message], (err) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).send("An error occurred while submitting your message.");
    }
    res.send("Thank you for contacting us!");
  });
});

// ✅ Start server (bind to 0.0.0.0 for hosting)
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

// ✅ Fix timeout issues
server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
