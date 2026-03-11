const pool = require("../config/db");

/* CREATE PATIENT */

exports.createPatient = async (req, res) => {
  try {

    const clinic_id = req.clinic.clinic_id;
    const { name, phone, age, address } = req.body;

    const newPatient = await pool.query(
      `INSERT INTO patients (clinic_id,name,phone,age,address)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [clinic_id, name, phone, age, address]
    );

    res.json(newPatient.rows[0]);

  } catch (err) {
    next(err)
  }
};


/* GET PATIENTS */
exports.getPatients = async (req, res, next) => {

  try {

    const clinic_id = req.clinic.clinic_id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const offset = (page - 1) * limit;

    const patients = await pool.query(
      `SELECT *
       FROM patients
       WHERE clinic_id = $1
       AND name ILIKE $2
       ORDER BY created_at DESC
       LIMIT $3 OFFSET $4`,
      [clinic_id, `%${search}%`, limit, offset]
    );

    res.json({
      page,
      limit,
      results: patients.rows
    });

  } catch (err) {
    next(err);
  }

};

/* UPDATE PATIENT */

exports.updatePatient = async (req, res) => {
  try {

    const clinic_id = req.clinic.clinic_id;
    const patient_id = req.params.id;

    const { name, phone, age, address } = req.body;

    const updatedPatient = await pool.query(
      `UPDATE patients
       SET name=$1, phone=$2, age=$3, address=$4
       WHERE id=$5 AND clinic_id=$6
       RETURNING *`,
      [name, phone, age, address, patient_id, clinic_id]
    );

    res.json(updatedPatient.rows[0]);

  } catch (err) {
    next(err)
  }
};


/* DELETE PATIENT */

exports.deletePatient = async (req, res) => {
  try {

    const clinic_id = req.clinic.clinic_id;
    const patient_id = req.params.id;

    await pool.query(
      "DELETE FROM patients WHERE id=$1 AND clinic_id=$2",
      [patient_id, clinic_id]
    );

    res.json({ message: "Patient deleted successfully" });

  } catch (err) {
      next(err)
  }
};