const pool = require("../config/db");
const apiResponse = require("../utils/apiResponse");

exports.getDashboardStats = async (req, res, next) => {

  try {

    const clinic_id = req.clinic.clinic_id;

    /* =========================
       TOTAL PATIENTS
    ========================= */

    const totalPatients = await pool.query(
      "SELECT COUNT(*) FROM patients WHERE clinic_id = $1",
      [clinic_id]
    );

    /* =========================
       APPOINTMENTS TODAY
    ========================= */

    const appointmentsToday = await pool.query(
      `SELECT COUNT(*)
       FROM appointments
       WHERE clinic_id = $1
       AND DATE(start_time) = CURRENT_DATE`,
      [clinic_id]
    );

    /* =========================
       MONTHLY REVENUE
    ========================= */

    const monthlyRevenue = await pool.query(
      `SELECT
         TO_CHAR(created_at, 'Mon') AS month,
         SUM(amount) AS revenue
       FROM invoices
       WHERE clinic_id = $1
       GROUP BY month
       ORDER BY MIN(created_at)`,
      [clinic_id]
    );

    /* =========================
       TOP TREATMENTS
    ========================= */

    const topTreatments = await pool.query(
      `SELECT treatment_type, COUNT(*) as count
       FROM treatments
       WHERE clinic_id = $1
       GROUP BY treatment_type
       ORDER BY count DESC
       LIMIT 5`,
      [clinic_id]
    );

    /* =========================
       RESPONSE
    ========================= */

    return apiResponse.success(
      res,
      {
        total_patients: Number(totalPatients.rows[0].count),
        appointments_today: Number(appointmentsToday.rows[0].count),
        monthly_revenue: monthlyRevenue.rows,
        top_treatments: topTreatments.rows
      },
      "Dashboard statistics fetched successfully"
    );

  } catch (err) {

    next(err);

  }

};
