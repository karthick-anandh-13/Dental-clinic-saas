const pool = require("../config/db");

/* CREATE MEDICAL HISTORY */

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

    res.json(history.rows[0]);

  } catch (err) {
    next(err);
  }

};



/* GET MEDICAL HISTORY */

exports.getMedicalHistory = async (req, res, next) => {

  try {

    const clinic_id = req.clinic.clinic_id;
    const patient_id = req.params.patient_id;

    const history = await pool.query(
      `SELECT *
       FROM medical_history
       WHERE clinic_id = $1
       AND patient_id = $2`,
      [clinic_id, patient_id]
    );

    res.json(history.rows);

  } catch (err) {
    next(err);
  }

};