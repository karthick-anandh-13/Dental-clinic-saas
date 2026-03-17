const pool = require("../config/db");
const auditService = require("../services/auditService");
const apiResponse = require("../utils/apiResponse");

/* =========================
   CREATE PATIENT
========================= */

exports.createPatient = async (req, res, next) => {
  try {
    const clinic_id = req.clinic.clinic_id;
    const user_id = req.user?.id || null;

    const { name, phone, age, address } = req.body;

    // Basic validation safety
    if (!name || !phone) {
      return apiResponse.error(res, "Name and phone are required", 400);
    }

    const newPatient = await pool.query(
      `INSERT INTO patients (clinic_id, name, phone, age, address)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [clinic_id, name, phone, age || null, address || null]
    );

    await auditService.logAction(
      clinic_id,
      user_id,
      "CREATE",
      "PATIENT",
      newPatient.rows[0].id
    );

    return apiResponse.success(
      res,
      newPatient.rows[0],
      "Patient created successfully"
    );

  } catch (err) {
    next(err);
  }
};

/* =========================
   GET ALL PATIENTS
========================= */

exports.getPatients = async (req, res, next) => {
  try {
    const clinic_id = req.clinic.clinic_id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const offset = (page - 1) * limit;

    const patients = await pool.query(
      `SELECT *
       FROM patients
       WHERE clinic_id = $1
       AND name ILIKE $2
       ORDER BY created_at DESC
       LIMIT $3 OFFSET $4`,
      [clinic_id, `%${search}%`, limit, offset]
    );

    return apiResponse.success(
      res,
      {
        page,
        limit,
        results: patients.rows
      },
      "Patients fetched successfully"
    );

  } catch (err) {
    next(err);
  }
};

/* =========================
   GET SINGLE PATIENT
========================= */

exports.getPatientById = async (req, res, next) => {
  try {
    const clinic_id = req.clinic.clinic_id;
    const patient_id = req.params.id;

    const patient = await pool.query(
      `SELECT *
       FROM patients
       WHERE id=$1 AND clinic_id=$2`,
      [patient_id, clinic_id]
    );

    if (patient.rows.length === 0) {
      return apiResponse.error(res, "Patient not found", 404);
    }

    return apiResponse.success(
      res,
      patient.rows[0],
      "Patient fetched successfully"
    );

  } catch (err) {
    next(err);
  }
};

/* =========================
   UPDATE PATIENT
========================= */

exports.updatePatient = async (req, res, next) => {
  try {
    const clinic_id = req.clinic.clinic_id;
    const user_id = req.user?.id || null;
    const patient_id = req.params.id;

    const { name, phone, age, address } = req.body;

    const updatedPatient = await pool.query(
      `UPDATE patients
       SET name=$1, phone=$2, age=$3, address=$4
       WHERE id=$5 AND clinic_id=$6
       RETURNING *`,
      [name, phone, age || null, address || null, patient_id, clinic_id]
    );

    if (updatedPatient.rows.length === 0) {
      return apiResponse.error(res, "Patient not found", 404);
    }

    await auditService.logAction(
      clinic_id,
      user_id,
      "UPDATE",
      "PATIENT",
      patient_id
    );

    return apiResponse.success(
      res,
      updatedPatient.rows[0],
      "Patient updated successfully"
    );

  } catch (err) {
    next(err);
  }
};

/* =========================
   DELETE PATIENT
========================= */

exports.deletePatient = async (req, res, next) => {
  try {
    const clinic_id = req.clinic.clinic_id;
    const user_id = req.user?.id || null;
    const patient_id = req.params.id;

    const deleted = await pool.query(
      `DELETE FROM patients
       WHERE id=$1 AND clinic_id=$2
       RETURNING id`,
      [patient_id, clinic_id]
    );

    if (deleted.rows.length === 0) {
      return apiResponse.error(res, "Patient not found", 404);
    }

    await auditService.logAction(
      clinic_id,
      user_id,
      "DELETE",
      "PATIENT",
      patient_id
    );

    return apiResponse.success(
      res,
      null,
      "Patient deleted successfully"
    );

  } catch (err) {
    next(err);
  }
};