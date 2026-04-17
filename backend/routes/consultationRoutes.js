const express = require("express");
const router = express.Router();
const consultationController = require("../controllers/consultationController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

/* =========================
   ROUTES
========================= */

// Public route for patients to submit requests (no auth required for submission)
router.post("/", consultationController.createConsultationRequest);

// Protected routes for staff
router.get("/", authMiddleware, roleMiddleware(["admin", "dentist", "staff"]), consultationController.getConsultationRequests);
router.put("/:id/status", authMiddleware, roleMiddleware(["admin", "dentist", "staff"]), consultationController.updateConsultationRequestStatus);

module.exports = router;