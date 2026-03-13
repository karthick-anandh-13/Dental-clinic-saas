const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const medicalHistoryController = require("../controllers/medicalHistoryController");

router.post(
  "/",
  authMiddleware,
  medicalHistoryController.createMedicalHistory
);

router.get(
  "/:patient_id",
  authMiddleware,
  medicalHistoryController.getMedicalHistory
);

module.exports = router;