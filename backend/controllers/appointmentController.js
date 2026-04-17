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

    const appointment = newAppointment.rows[0];

    /* FETCH PATIENT AND DENTIST FOR NOTIFICATIONS */
    const patientResult = await pool.query(
      "SELECT name, phone FROM patients WHERE id = $1 AND clinic_id = $2",
      [patient_id, clinic_id]
    );
    const dentistResult = await pool.query(
      "SELECT name FROM users WHERE id = $1 AND clinic_id = $2",
      [dentist_id, clinic_id]
    );

    const patient = patientResult.rows[0];
    const dentist = dentistResult.rows[0];

    /* AUDIT LOG */
    await auditService.logAction(
      clinic_id,
      req.user?.id || null,
      "CREATE",
      "APPOINTMENT",
      appointment.id
    );

    apiResponse.success(
      res,
      appointment,
      "Appointment created successfully"
    );

    /* SEND NOTIFICATIONS IN BACKGROUND */
    if (patient?.phone && dentist?.name) {
      const { notifyAppointment } = require("../services/notificationService");
      notifyAppointment(patient.phone, patient.name, dentist.name, appointment.start_time)
        .catch((error) => console.error("Appointment notification failed:", error));
    }

    return;

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
    const patient_id = req.query.patient_id;

    let query = `
      SELECT
        appointments.*,
        patients.name AS patient_name,
        users.name AS dentist_name
      FROM appointments
      JOIN patients ON appointments.patient_id = patients.id
      JOIN users ON appointments.dentist_id = users.id
      WHERE appointments.clinic_id = $1
    `;

    const values = [clinic_id];

    // 🔥 FILTER BY PATIENT (IMPORTANT)
    if (patient_id) {
      query += ` AND appointments.patient_id = $2`;
      values.push(patient_id);
    }

    query += ` ORDER BY start_time DESC`;

    const appointments = await pool.query(query, values);

    res.json(appointments.rows);

  } catch (err) {
    next(err);
  }
};

/* =========================
   DELETE APPOINTMENT
========================= */

exports.deleteAppointment = async (req, res, next) => {
  try {
    const clinic_id = req.clinic.clinic_id;
    const appointment_id = req.params.id;

    const appointment = await pool.query(
      `SELECT * FROM appointments WHERE id = $1 AND clinic_id = $2`,
      [appointment_id, clinic_id]
    );

    if (appointment.rows.length === 0) {
      return apiResponse.error(res, "Appointment not found", 404);
    }

    await pool.query(
      `DELETE FROM appointments WHERE id = $1`,
      [appointment_id]
    );

    await auditService.logAction(
      clinic_id,
      req.user?.id || null,
      "DELETE",
      "APPOINTMENT",
      appointment_id
    );

    return apiResponse.success(res, null, "Appointment deleted successfully");

  } catch (err) {
    next(err);
  }
};