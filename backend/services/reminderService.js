const cron = require("node-cron");
const pool = require("../config/db");
const { notifyReminder } = require("./notificationService");

const startReminderService = () => {

  /* Runs every day at 9 AM */

  cron.schedule("0 9 * * *", async () => {

    try {

      const appointments = await pool.query(
        `SELECT
           appointments.start_time,
           patients.name AS patient_name,
           patients.phone
         FROM appointments
         JOIN patients ON appointments.patient_id = patients.id
         WHERE DATE(appointments.start_time) = CURRENT_DATE + INTERVAL '1 day'`
      );

      appointments.rows.forEach(appt => {
        console.log(
          `Reminder: ${appt.patient_name} has an appointment tomorrow at ${appt.start_time}`
        );

        notifyReminder(appt.phone, appt.patient_name, appt.start_time)
          .catch(err => console.error("Notification reminder error:", err));
      });

    } catch (err) {

      console.error("Reminder service error:", err);

    }

  });

};

module.exports = startReminderService;