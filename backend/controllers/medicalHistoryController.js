const pool = require("../config/db");
const apiResponse = require("../utils/apiResponse");
const auditService = require("../services/auditService");

/* =========================
   CREATE MEDICAL HISTORY
========================= */

exports.createMedicalHistory = async (req, res, next) => {

  try {

    const clinic_id = req.clinic.clinic_id;

    const {
      patient_id,
      allergies,
      medical_conditions,
      notes
    } = req.body;

    const history = await pool.query(
      `INSERT INTO medical_history
       (clinic_id, patient_id, allergies, medical_conditions, notes)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [
        clinic_id,
        patient_id,
        allergies,
        medical_conditions,
        notes
      ]
    );

    /* AUDIT LOG */

    await auditService.logAction(
      clinic_id,
      req.user?.id || null,
      "CREATE",
      "MEDICAL_HISTORY",
      history.rows[0].id
    );

    return apiResponse.success(
      res,
      history.rows[0],
      "Medical history created successfully"
    );

  } catch (err) {
    next(err);
  }

};



/* =========================
   GET MEDICAL HISTORY
========================= */

exports.getMedicalHistory = async (req, res, next) => {

  try {

    const clinic_id = req.clinic.clinic_id;
    const patient_id = req.params.patient_id;

    const history = await pool.query(
      `SELECT *
       FROM medical_history
       WHERE clinic_id = $1
       AND patient_id = $2
       ORDER BY created_at DESC`,
      [clinic_id, patient_id]
    );

    return apiResponse.success(
      res,
      history.rows,
      "Medical history fetched successfully"
    );

  } catch (err) {
    next(err);
  }

};
