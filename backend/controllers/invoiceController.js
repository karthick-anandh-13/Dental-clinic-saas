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

    console.error(err.message);
    res.status(500).send("Server error");

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

    console.error(err.message);
    res.status(500).send("Server error");

  }

};