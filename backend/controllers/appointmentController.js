const pool = require("../config/db");
const apiResponse = require("../utils/apiResponse");
const auditService = require("../services/auditService");

/* =========================
   CREATE APPOINTMENT
========================= */

exports.createAppointment = async (req, res, next) => {

  try {

    const clinic_id = req.clinic.clinic_id;

    const {
      patient_id,
      dentist_id,
      start_time,
      end_time
    } = req.body;

    /* CHECK TIME CONFLICT */

    const conflict = await pool.query(
      `SELECT *
       FROM appointments
       WHERE dentist_id = $1
       AND clinic_id = $2
       AND (
          ($3 BETWEEN start_time AND end_time)
          OR
          ($4 BETWEEN start_time AND end_time)
          OR
          (start_time BETWEEN $3 AND $4)
       )`,
      [dentist_id, clinic_id, start_time, end_time]
    );

    if (conflict.rows.length > 0) {
      return apiResponse.error(
        res,
        "Dentist already has an appointment at this time",
        400
      );
    }

    /* CREATE APPOINTMENT */

    const newAppointment = await pool.query(
      `INSERT INTO appointments
      (clinic_id, patient_id, dentist_id, start_time, end_time)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [
        clinic_id,
        patient_id,
        dentist_id,
        start_time,
        end_time
      ]
    );

    /* AUDIT LOG */

    await auditService.logAction(
      clinic_id,
      req.user?.id || null,
      "CREATE",
      "APPOINTMENT",
      newAppointment.rows[0].id
    );

    return apiResponse.success(
      res,
      newAppointment.rows[0],
      "Appointment created successfully"
    );

  } catch (err) {
    next(err);
  }

};


/* =========================
   GET APPOINTMENTS
========================= */

exports.getAppointments = async (req, res, next) => {

  try {

    const clinic_id = req.clinic.clinic_id;

    const appointments = await pool.query(
      `SELECT
        appointments.*,
        patients.name AS patient_name,
        users.name AS dentist_name
       FROM appointments
       JOIN patients ON appointments.patient_id = patients.id
       JOIN users ON appointments.dentist_id = users.id
       WHERE appointments.clinic_id = $1
       ORDER BY start_time`,
      [clinic_id]
    );

    return apiResponse.success(
      res,
      appointments.rows,
      "Appointments fetched successfully"
    );

  } catch (err) {
    next(err);
  }

};
