const pool = require("../config/db");
const apiResponse = require("../utils/apiResponse");
const auditService = require("../services/auditService");


/* =========================
   CREATE TREATMENT
========================= */

exports.createTreatment = async (req, res, next) => {

  try {

    const clinic_id = req.clinic.clinic_id;

    const {
      patient_id,
      appointment_id,
      treatment_type,
      notes,
      cost
    } = req.body;

    const newTreatment = await pool.query(
      `INSERT INTO treatments
       (clinic_id, patient_id, appointment_id, treatment_type, notes, cost)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [
        clinic_id,
        patient_id,
        appointment_id,
        treatment_type,
        notes,
        cost
      ]
    );

    /* AUDIT LOG */

    await auditService.logAction(
      clinic_id,
      req.user?.id || null,
      "CREATE",
      "TREATMENT",
      newTreatment.rows[0].id
    );

    return apiResponse.success(
      res,
      newTreatment.rows[0],
      "Treatment created successfully"
    );

  } catch (err) {

    next(err);

  }

};


/* =========================
   GET TREATMENTS
========================= */

exports.getTreatments = async (req, res, next) => {
  try {

    const clinic_id = req.clinic.clinic_id;
    const patient_id = req.query.patient_id;

    let query = `
      SELECT
        treatments.*
      FROM treatments
      WHERE treatments.clinic_id = $1
    `;

    const values = [clinic_id];

    // 🔥 FILTER BY PATIENT IF PROVIDED
    if (patient_id) {
      query += ` AND treatments.patient_id = $2`;
      values.push(patient_id);
    }

    query += ` ORDER BY treatments.created_at DESC`;

    const treatments = await pool.query(query, values);

    return apiResponse.success(res, treatments.rows, "Treatments retrieved successfully");

  } catch (err) {
    next(err);
  }
};