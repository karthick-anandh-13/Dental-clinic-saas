const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const dashboardController = require("../controllers/dashboardController");

/* DASHBOARD ANALYTICS */

router.get("/", authMiddleware, dashboardController.getDashboardStats);

module.exports = router;