const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const apiResponse = require("../utils/apiResponse");


/* =========================
   CLINIC SIGNUP
========================= */

exports.signup = async (req, res, next) => {

  try {

    const { clinic_name, email, password } = req.body;

    /* CHECK IF CLINIC EXISTS */

    const clinicExists = await pool.query(
      "SELECT id FROM clinics WHERE email = $1",
      [email]
    );

    if (clinicExists.rows.length > 0) {
      return apiResponse.error(res, "Clinic already exists", 400);
    }

    /* HASH PASSWORD */

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    /* CREATE CLINIC */

    const newClinic = await pool.query(
      `INSERT INTO clinics (clinic_name, email, password)
       VALUES ($1,$2,$3)
       RETURNING id, clinic_name, email`,
      [clinic_name, email, hashedPassword]
    );

    return apiResponse.success(
      res,
      newClinic.rows[0],
      "Clinic registered successfully"
    );

  } catch (err) {
    next(err);
  }

};



/* =========================
   LOGIN
========================= */

exports.login = async (req, res, next) => {

  try {

    const { email, password } = req.body;

    const clinic = await pool.query(
      "SELECT * FROM clinics WHERE email = $1",
      [email]
    );

    if (clinic.rows.length === 0) {
      return apiResponse.error(res, "Clinic not found", 404);
    }

    const validPassword = await bcrypt.compare(
      password,
      clinic.rows[0].password
    );

    if (!validPassword) {
      return apiResponse.error(res, "Invalid password", 401);
    }

    /* CREATE JWT TOKEN */

    const token = jwt.sign(
      {
        clinic_id: clinic.rows[0].id,
        user_id: clinic.rows[0].id
      },
      process.env.JWT_SECRET || "supersecretkey",
      { expiresIn: "7d" }
    );

    return apiResponse.success(
      res,
      {
        clinic: clinic.rows[0].clinic_name,
        token
      },
      "Login successful"
    );

  } catch (err) {
    next(err);
  }

};
