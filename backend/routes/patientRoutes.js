const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

/* =========================
   CREATE PATIENT
========================= */

router.post("/", authMiddleware, async (req, res) => {
  try {

    const clinic_id = req.clinic.clinic_id;

    const { name, phone, age, address } = req.body;

    const newPatient = await pool.query(
      "INSERT INTO patients (clinic_id,name,phone,age,address) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [clinic_id, name, phone, age, address]
    );

    res.json(newPatient.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/* =========================
   GET ALL PATIENTS
========================= */

router.get("/", authMiddleware, async (req, res) => {
  try {

    const clinic_id = req.clinic.clinic_id;

    const patients = await pool.query(
      "SELECT * FROM patients WHERE clinic_id = $1",
      [clinic_id]
    );

    res.json(patients.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;