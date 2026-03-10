const pool = require("../config/db");

/* CREATE APPOINTMENT */

exports.createAppointment = async (req, res) => {

  try {

    const clinic_id = req.clinic.clinic_id;

    const {
      patient_id,
      doctor_name,
      appointment_date,
      appointment_time
    } = req.body;

    const newAppointment = await pool.query(
      `INSERT INTO appointments 
       (clinic_id, patient_id, doctor_name, appointment_date, appointment_time)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [clinic_id, patient_id, doctor_name, appointment_date, appointment_time]
    );

    res.json(newAppointment.rows[0]);

  } catch (err) {

    console.error(err.message);
    res.status(500).send("Server error");

  }

};


/* GET APPOINTMENTS */

exports.getAppointments = async (req, res) => {

  try {

    const clinic_id = req.clinic.clinic_id;

    const appointments = await pool.query(
      `SELECT 
        appointments.*, 
        patients.name AS patient_name
       FROM appointments
       JOIN patients ON appointments.patient_id = patients.id
       WHERE appointments.clinic_id = $1
       ORDER BY appointment_date`,
      [clinic_id]
    );

    res.json(appointments.rows);

  } catch (err) {

    console.error(err.message);
    res.status(500).send("Server error");

  }

};