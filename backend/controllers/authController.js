const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


/* =========================
   CLINIC SIGNUP
========================= */

exports.signup = async (req, res, next) => {

  try {

    const { clinic_name, email, password } = req.body;

    // check if clinic already exists
    const clinicExists = await pool.query(
      "SELECT * FROM clinics WHERE email = $1",
      [email]
    );

    if (clinicExists.rows.length > 0) {
      return res.status(400).json({
        message: "Clinic already exists"
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create clinic
    const newClinic = await pool.query(
      `INSERT INTO clinics (clinic_name, email, password)
       VALUES ($1,$2,$3)
       RETURNING id, clinic_name, email`,
      [clinic_name, email, hashedPassword]
    );

    res.json({
      message: "Clinic registered successfully",
      clinic: newClinic.rows[0]
    });

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
      return res.status(400).json({
        message: "Clinic not found"
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      clinic.rows[0].password
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      {
        clinic_id: clinic.rows[0].id,
        user_id: clinic.rows[0].id
      },
      process.env.JWT_SECRET || "supersecretkey",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      clinic: clinic.rows[0].clinic_name,
      token: token
    });

  } catch (err) {
    next(err);
  }

};