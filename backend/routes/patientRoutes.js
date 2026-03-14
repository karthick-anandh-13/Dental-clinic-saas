const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");

const patientController = require("../controllers/patientController");
const patientSchema = require("../validators/patientValidator");

/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: Patient management APIs
 */

/**
 * @swagger
 * /api/v1/patients:
 *   post:
 *     summary: Create a new patient
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               age:
 *                 type: integer
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Patient created successfully
 */
router.post(
  "/",
  authMiddleware,
  validate(patientSchema),
  patientController.createPatient
);

/**
 * @swagger
 * /api/v1/patients:
 *   get:
 *     summary: Get all patients
 *     tags: [Patients]
 *     responses:
 *       200:
 *         description: List of patients
 */
router.get(
  "/",
  authMiddleware,
  patientController.getPatients
);

/**
 * @swagger
 * /api/v1/patients/{id}:
 *   put:
 *     summary: Update patient details
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Patient ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               age:
 *                 type: integer
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Patient updated successfully
 */
router.put(
  "/:id",
  authMiddleware,
  validate(patientSchema),
  patientController.updatePatient
);

/**
 * @swagger
 * /api/v1/patients/{id}:
 *   delete:
 *     summary: Delete a patient
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Patient ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 */
router.delete(
  "/:id",
  authMiddleware,
  patientController.deletePatient
);

module.exports = router;