const pool = require("../config/db");

exports.uploadFile = async (req, res, next) => {

 try {

  const clinic_id = req.clinic.clinic_id;
  const patient_id = req.body.patient_id;

  const file = req.file;

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

  res.json(result.rows[0]);

 } catch (err) {

  next(err);

 }

};



exports.getPatientFiles = async (req, res, next) => {

 try {

  const clinic_id = req.clinic.clinic_id;
  const patient_id = req.params.patient_id;

  const files = await pool.query(
   `SELECT *
    FROM patient_files
    WHERE clinic_id=$1
    AND patient_id=$2`,
   [clinic_id, patient_id]
  );

  res.json(files.rows);

 } catch (err) {

  next(err);

 }

};