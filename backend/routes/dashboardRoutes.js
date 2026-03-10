const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

/* DASHBOARD ANALYTICS */

router.get("/", authMiddleware, async (req, res) => {

  try {

    const clinic_id = req.clinic.clinic_id;

    const totalPatients = await pool.query(
      "SELECT COUNT(*) FROM patients WHERE clinic_id = $1",
      [clinic_id]
    );

    const totalAppointments = await pool.query(
      "SELECT COUNT(*) FROM appointments WHERE clinic_id = $1",
      [clinic_id]
    );

    const totalTreatments = await pool.query(
      "SELECT COUNT(*) FROM treatments WHERE clinic_id = $1",
      [clinic_id]
    );

    const totalRevenue = await pool.query(
      "SELECT COALESCE(SUM(amount),0) FROM invoices WHERE clinic_id = $1",
      [clinic_id]
    );

    res.json({
      total_patients: totalPatients.rows[0].count,
      total_appointments: totalAppointments.rows[0].count,
      total_treatments: totalTreatments.rows[0].count,
      total_revenue: totalRevenue.rows[0].coalesce
    });

  } catch (err) {

    console.error(err.message);
    res.status(500).send("Server error");

  }

});

module.exports = router;