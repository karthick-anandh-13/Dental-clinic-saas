const pool = require("../config/db");


/* =========================
   CREATE INVOICE
========================= */

exports.createInvoice = async (req, res) => {

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

    res.json(newInvoice.rows[0]);

  } catch (err) {

    next(err)

  }

};


/* =========================
   GET INVOICES
========================= */

exports.getInvoices = async (req, res) => {

  try {

    const clinic_id = req.clinic.clinic_id;

    const invoices = await pool.query(
      `SELECT
        invoices.*,
        patients.name AS patient_name
       FROM invoices
       JOIN patients ON invoices.patient_id = patients.id
       WHERE invoices.clinic_id = $1
       ORDER BY invoices.created_at DESC`,
      [clinic_id]
    );

    res.json(invoices.rows);

  } catch (err) {
     next(err)
  }

};

const { generateInvoicePDF } = require("../services/invoiceService");

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
      return res.status(404).json({
        message: "Invoice not found"
      });
    }

    const filePath = generateInvoicePDF(invoice.rows[0]);

    res.download(filePath);

  } catch (err) {
    next(err);
  }

};