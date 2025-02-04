import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); 

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "teju1120", 
  database: "college" 
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database!");
});

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/public/contact.html");
});

// Route to serve the registration form (if not in public folder)
app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/public/register.html");
});

// Route to handle registration form submission
app.post("/register", (req, res) => {
  const { name, email, phone, course } = req.body;

  // Check if the user is already registered
  const checkSql = "SELECT * FROM students WHERE email = ?";
  db.query(checkSql, [email], (err, result) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.status(500).send("An error occurred while checking your registration.");
    }

    if (result.length > 0) {
      // User already registered
      return res.send("You are already registered with this email!");
    } else {
      // Proceed with the registration
      const insertSql = "INSERT INTO students (name, email, phone, course) VALUES (?, ?, ?, ?)";
      db.query(insertSql, [name, email, phone, course], (err, result) => {
        if (err) {
          console.error("Error inserting data into database:", err);
          return res.status(500).send("An error occurred while processing your registration.");
        }
        res.send("Registration successful! Your data has been saved.");
      });
    }
  });
});


// Route to handle contact form submission
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;

  const sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
  db.query(sql, [name, email, message], (err, result) => {
    if (err) {
      console.error("Error inserting data into database:", err);
      return res.status(500).send("An error occurred while submitting your message.");
    }
    res.send("Thank you for contacting us! Your message has been saved.");
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

