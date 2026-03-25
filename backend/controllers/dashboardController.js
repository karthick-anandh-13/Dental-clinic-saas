const pool = require("../config/db");
const apiResponse = require("../utils/apiResponse");

exports.getDashboardStats = async (req, res, next) => {

  try {

    const clinicId = req.clinic.clinic_id;
    console.log("Clinic ID:", clinicId);
    if (!clinicId) {
      return res.status(400).json({
        success: false,
        message: "Clinic ID missing"
      });
    }
    /* =========================
       TOTAL PATIENTS
    ========================= */
    const totalPatients = await pool.query(
      "SELECT COUNT(*) FROM patients WHERE clinic_id = $1",
      [clinicId]
    );

    /* =========================
       APPOINTMENTS TODAY
    ========================= */
    const appointmentsToday = await pool.query(
      `SELECT COUNT(*)
       FROM appointments
       WHERE clinic_id = $1
       AND DATE(start_time) = CURRENT_DATE`,
      [clinicId]
    );

    /* =========================
       TOTAL REVENUE
    ========================= */
    const totalRevenue = await pool.query(
      `SELECT COALESCE(SUM(amount),0) as total
       FROM invoices
       WHERE clinic_id = $1`,
      [clinicId]
    );

    /* =========================
       LAST 7 DAYS CHART
    ========================= */
    const chartData = await pool.query(
      `SELECT 
         TO_CHAR(start_time, 'DD Mon') as date,
         COUNT(*) as count
       FROM appointments
       WHERE clinic_id = $1
       AND start_time >= NOW() - INTERVAL '7 days'
       GROUP BY date
       ORDER BY MIN(start_time)`,
      [clinicId]
    );

    /* =========================
       RESPONSE (IMPORTANT FIX)
    ========================= */

    return apiResponse.success(
      res,
      {
        stats: {
          patients: Number(totalPatients.rows[0].count),
          appointments: Number(appointmentsToday.rows[0].count),
          revenue: Number(totalRevenue.rows[0].total)
        },
        chart: chartData.rows
      },
      "Dashboard data fetched successfully"
    );

  } catch (err) {
    next(err);
  }

};