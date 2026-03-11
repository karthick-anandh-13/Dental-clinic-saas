const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const patientController = require("../controllers/patientController");
const validate = require("../middleware/validateMiddleware");
const patientSchema = require("../validators/patientValidator");
/* =========================
   CREATE PATIENT
========================= */

router.post("/", authMiddleware, validate(patientSchema), patientController.createPatient);

/* =========================
   GET ALL PATIENTS
========================= */

router.get("/", authMiddleware, patientController.getPatients);

/* =========================
   UPDATE PATIENT
========================= */

router.put("/:id", authMiddleware, patientController.updatePatient);

/* =========================
   DELETE PATIENT
========================= */

router.delete("/:id", authMiddleware, patientController.deletePatient);

module.exports = router;