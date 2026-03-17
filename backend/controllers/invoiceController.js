const pool = require("../config/db");
const apiResponse = require("../utils/apiResponse");
const auditService = require("../services/auditService");
const { generateInvoicePDF } = require("../services/invoiceService");


/* =========================
   CREATE INVOICE
========================= */

exports.createInvoice = async (req, res, next) => {

  try {

    const clinic_id = req.clinic.clinic_id;

    const {
      patient_id,
      treatment_id,
      amount,
      payment_method
    } = req.body;

    const newInvoice = await pool.query(
      `INSERT INTO invoices
       (clinic_id, patient_id, treatment_id, amount, payment_method)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [clinic_id, patient_id, treatment_id, amount, payment_method]
    );

    /* AUDIT LOG */

    await auditService.logAction(
      clinic_id,
      req.user?.id || null,
      "CREATE",
      "INVOICE",
      newInvoice.rows[0].id
    );

    return apiResponse.success(
      res,
      newInvoice.rows[0],
      "Invoice created successfully"
    );

  } catch (err) {
    next(err);
  }

};


/* =========================
   GET INVOICES
========================= */

exports.getInvoices = async (req, res, next) => {
  try {

    const clinic_id = req.clinic.clinic_id;
    const patient_id = req.query.patient_id;

    let query = `
      SELECT
        invoices.*,
        patients.name AS patient_name
      FROM invoices
      JOIN patients ON invoices.patient_id = patients.id
      WHERE invoices.clinic_id = $1
    `;

    const values = [clinic_id];

    // 🔥 FILTER BY PATIENT
    if (patient_id) {
      query += ` AND invoices.patient_id = $2`;
      values.push(patient_id);
    }

    query += ` ORDER BY invoices.created_at DESC`;

    const invoices = await pool.query(query, values);

    res.json(invoices.rows);

  } catch (err) {
    next(err);
  }
};

/* =========================
   DOWNLOAD INVOICE PDF
========================= */

exports.downloadInvoice = async (req, res, next) => {

  try {

    const invoice_id = req.params.id;

    const invoice = await pool.query(
      `SELECT invoices.*, patients.name AS patient_name, treatments.treatment_type
       FROM invoices
       JOIN patients ON invoices.patient_id = patients.id
       JOIN treatments ON invoices.treatment_id = treatments.id
       WHERE invoices.id = $1`,
      [invoice_id]
    );

    if (invoice.rows.length === 0) {
      return apiResponse.error(res, "Invoice not found", 404);
    }

    const filePath = generateInvoicePDF(invoice.rows[0]);

    return res.download(filePath);

  } catch (err) {
    next(err);
  }

};
