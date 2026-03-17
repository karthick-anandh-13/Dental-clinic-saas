const express = require("express");
const router = express.Router();

/* =========================
   IMPORTS
========================= */

const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");

const patientController = require("../controllers/patientController");
const patientSchema = require("../validators/patientValidator");

/* =========================
   SAFETY CHECKS (PREVENT CRASH)
========================= */

if (typeof authMiddleware !== "function") {
  throw new Error("authMiddleware is not a function");
}

if (typeof validate !== "function") {
  throw new Error("validate middleware is not a function");
}

if (!patientController) {
  throw new Error("patientController not found");
}

const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient
} = patientController;

if (typeof createPatient !== "function") {
  throw new Error("createPatient is not a function");
}
if (typeof getPatients !== "function") {
  throw new Error("getPatients is not a function");
}
if (typeof getPatientById !== "function") {
  throw new Error("getPatientById is not a function");
}
if (typeof updatePatient !== "function") {
  throw new Error("updatePatient is not a function");
}
if (typeof deletePatient !== "function") {
  throw new Error("deletePatient is not a function");
}

/* =========================
   ROUTES
========================= */

/**
 * CREATE PATIENT
 * POST /api/v1/patients
 */
router.post(
  "/",
  authMiddleware,
  validate(patientSchema),
  createPatient
);

/**
 * GET ALL PATIENTS
 * GET /api/v1/patients
 */
router.get(
  "/",
  authMiddleware,
  getPatients
);

/**
 * GET SINGLE PATIENT
 * GET /api/v1/patients/:id
 */
router.get(
  "/:id",
  authMiddleware,
  getPatientById
);

/**
 * UPDATE PATIENT
 * PUT /api/v1/patients/:id
 */
router.put(
  "/:id",
  authMiddleware,
  validate(patientSchema),
  updatePatient
);

/**
 * DELETE PATIENT
 * DELETE /api/v1/patients/:id
 */
router.delete(
  "/:id",
  authMiddleware,
  deletePatient
);

/* =========================
   EXPORT
========================= */

module.exports = router;