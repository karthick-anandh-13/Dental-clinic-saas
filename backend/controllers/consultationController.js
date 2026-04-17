const pool = require("../config/db");
const auditService = require("../services/auditService");
const apiResponse = require("../utils/apiResponse");

/* =========================
   CREATE CONSULTATION REQUEST
========================= */

exports.createConsultationRequest = async (req, res, next) => {
  try {
    const clinic_id = req.clinic?.clinic_id;
    const user_id = req.user?.id || null;

    if (!clinic_id) {
      return apiResponse.error(res, "Unauthorized: clinic missing", 401);
    }

    const {
      patient_name,
      patient_phone,
      patient_email,
      specialist_type,
      consultation_details,
      urgency_level
    } = req.body;

    /* Validation */
    if (!patient_name || !patient_phone || !specialist_type) {
      return apiResponse.error(res, "Patient name, phone, and specialist type are required", 400);
    }

    const newRequest = await pool.query(
      `INSERT INTO consultation_requests (clinic_id, patient_name, patient_phone, patient_email, specialist_type, consultation_details, urgency_level, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', NOW())
       RETURNING *`,
      [
        clinic_id,
        patient_name.trim(),
        patient_phone.trim(),
        patient_email || null,
        specialist_type,
        consultation_details || null,
        urgency_level || 'normal'
      ]
    );

    await auditService.logAction(
      clinic_id,
      user_id,
      "CREATE",
      "consultation_request",
      newRequest.rows[0].id,
      { patient_name, specialist_type }
    );

    apiResponse.success(res, "Consultation request submitted successfully", newRequest.rows[0]);
  } catch (error) {
    console.error("Error creating consultation request:", error);
    apiResponse.error(res, "Failed to submit consultation request", 500);
  }
};

/* =========================
   GET CONSULTATION REQUESTS (for staff)
========================= */

exports.getConsultationRequests = async (req, res, next) => {
  try {
    const clinic_id = req.clinic?.clinic_id;

    if (!clinic_id) {
      return apiResponse.error(res, "Unauthorized: clinic missing", 401);
    }

    const { status } = req.query;

    let query = `SELECT * FROM consultation_requests WHERE clinic_id = $1`;
    let params = [clinic_id];

    if (status) {
      query += ` AND status = $2`;
      params.push(status);
    }

    query += ` ORDER BY created_at DESC`;

    const requests = await pool.query(query, params);

    apiResponse.success(res, "Consultation requests retrieved", requests.rows);
  } catch (error) {
    console.error("Error fetching consultation requests:", error);
    apiResponse.error(res, "Failed to fetch consultation requests", 500);
  }
};

/* =========================
   UPDATE CONSULTATION REQUEST STATUS
========================= */

exports.updateConsultationRequestStatus = async (req, res, next) => {
  try {
    const clinic_id = req.clinic?.clinic_id;
    const user_id = req.user?.id || null;
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!clinic_id) {
      return apiResponse.error(res, "Unauthorized: clinic missing", 401);
    }

    if (!['pending', 'contacted', 'completed', 'cancelled'].includes(status)) {
      return apiResponse.error(res, "Invalid status", 400);
    }

    const updatedRequest = await pool.query(
      `UPDATE consultation_requests
       SET status = $1, notes = $2, updated_at = NOW()
       WHERE id = $3 AND clinic_id = $4
       RETURNING *`,
      [status, notes || null, id, clinic_id]
    );

    if (updatedRequest.rows.length === 0) {
      return apiResponse.error(res, "Consultation request not found", 404);
    }

    await auditService.logAction(
      clinic_id,
      user_id,
      "UPDATE",
      "consultation_request",
      id,
      { status, notes }
    );

    apiResponse.success(res, "Consultation request updated", updatedRequest.rows[0]);
  } catch (error) {
    console.error("Error updating consultation request:", error);
    apiResponse.error(res, "Failed to update consultation request", 500);
  }
};