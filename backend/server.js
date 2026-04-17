const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const treatmentRoutes = require("./routes/treatmentRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");
const medicalHistoryRoutes = require("./routes/medicalHistoryRoutes");
const fileRoutes = require("./routes/fileRoutes");
const consultationRoutes = require("./routes/consultationRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");

const limiter = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorMiddleware");
const auditRoutes = require("./routes/auditRoutes");
const startReminderService = require("./services/reminderService");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const seedAdminClinic = require("./services/devSeedService");
dotenv.config();

const app = express();

/* ========================
   GLOBAL MIDDLEWARE
======================== */

app.use(morgan("dev"));          // API request logging
app.use(helmet());               // Security headers
app.use(cors());                 // Cross origin access
app.use(express.json());         // JSON body parser
app.use(limiter);                // Rate limiting

/* ========================
   STATIC FILES
======================== */

app.use("/uploads", express.static("uploads"));

/* ========================
   API ROUTES (VERSIONED)
======================== */

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/patients", patientRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/treatments", treatmentRoutes);
app.use("/api/v1/invoices", invoiceRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/medical-history", medicalHistoryRoutes);
app.use("/api/v1/files", fileRoutes);
app.use("/api/v1/audit", auditRoutes);
app.use("/api/v1/consultations", consultationRoutes);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
/* ========================
   ROOT ROUTE
======================== */

app.get("/", (req, res) => {
  res.send("Dental SaaS API Running");
});

/* ========================
   DATABASE TEST
======================== */

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database connection error");
  }
});

/* ========================
   GLOBAL ERROR HANDLER
======================== */

app.use(errorHandler);

/* ========================
   SERVER START
======================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await seedAdminClinic();
  startReminderService();
});