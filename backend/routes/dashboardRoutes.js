const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const dashboardController = require("../controllers/dashboardController");

/* =========================
   GET DASHBOARD STATS
========================= */
router.get(
  "/",
  authMiddleware,
  dashboardController.getDashboardStats
);

module.exports = router;