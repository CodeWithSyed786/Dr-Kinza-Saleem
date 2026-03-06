const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Explicitly bind to IPv4

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging Middleware - Debugging
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});

// CORS Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  next();
});

// Serve frontend static files explicitly
const staticPath = path.join(__dirname, "../frontend");
console.log(`📂 Serving static files from: ${staticPath}`);
app.use(express.static(staticPath));

const DATA_FILE = path.join(__dirname, "submissions.json");

// Initialize Data File Safely
if (!fs.existsSync(DATA_FILE)) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
    console.log("📁 submissions.json created");
  } catch (err) {
    console.error("❌ Error creating data file:", err);
  }
}

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", backend: "Running" });
});

// Appointment API with Error Handling
app.post("/api/appointment", (req, res) => {
  try {
    const formData = req.body;

    // Basic Validation
    if (!formData.name || !formData.phone || !formData.date) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    let data = [];
    try {
      const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
      data = JSON.parse(fileContent);
      if (!Array.isArray(data)) data = [];
    } catch (readError) {
      console.warn("⚠️ Error reading data file, initializing new array:", readError);
      data = [];
    }

    const newEntry = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString()
    };

    data.push(newEntry);

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

    console.log(`✅ New Appointment: ${formData.name} (${formData.date})`);
    res.json({ success: true, message: "Appointment booked successfully" });

  } catch (error) {
    console.error("❌ Error saving appointment:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Stats API
app.get("/api/stats", (req, res) => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return res.json({ totalAppointments: 0 });
    }
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json({ totalAppointments: Array.isArray(data) ? data.length : 0 });
  } catch (error) {
    console.error("❌ Error fetching stats:", error);
    res.status(500).json({ error: "Could not fetch stats" });
  }
});

// Fallback - serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(PORT, HOST, () => {
  console.log("==================================================");
  console.log("🏥 DR KINZA MEDICAL WEBSITE BACKEND");
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`✅ Network Interface: http://${HOST}:${PORT}`);
  console.log("==================================================");
});
