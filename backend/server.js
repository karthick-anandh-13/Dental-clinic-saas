const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const app = express();
const authMiddleware = require("./middleware/authMiddleware");
const patientRoutes = require("./routes/patientRoutes");

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);

app.get("/", (req, res) => {
    res.send("Dental SaaS API Running");
});

app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Database connection error");
    }
});

app.get("/api/dashboard", authMiddleware, (req, res) => {
  res.json({
    message: "Welcome to Dental SaaS Dashboard",
    clinic_id: req.clinic.clinic_id
  });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});