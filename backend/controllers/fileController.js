const pool = require("../config/db");
const apiResponse = require("../utils/apiResponse");

/* =========================
   UPLOAD FILE
========================= */

exports.uploadFile = async (req, res, next) => {

  try {

    const clinic_id = req.clinic.clinic_id;
    const patient_id = req.body.patient_id;
    const file = req.file;

    if (!file) {
      return apiResponse.error(res, "No file uploaded", 400);
    }

    const result = await pool.query(
      `INSERT INTO patient_files
       (clinic_id, patient_id, file_name, file_path)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [
        clinic_id,
        patient_id,
        file.filename,
        file.path
      ]
    );

    return apiResponse.success(
      res,
      result.rows[0],
      "File uploaded successfully"
    );

  } catch (err) {
    next(err);
  }

};


/* =========================
   GET PATIENT FILES
========================= */

exports.getPatientFiles = async (req, res, next) => {

  try {

    const clinic_id = req.clinic.clinic_id;
    const patient_id = req.params.patient_id;

    const files = await pool.query(
      `SELECT *
       FROM patient_files
       WHERE clinic_id=$1
       AND patient_id=$2
       ORDER BY created_at DESC`,
      [clinic_id, patient_id]
    );

    return apiResponse.success(
      res,
      files.rows,
      "Patient files fetched successfully"
    );

  } catch (err) {
    next(err);
  }

};
