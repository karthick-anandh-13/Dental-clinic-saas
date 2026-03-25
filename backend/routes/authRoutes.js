const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* =========================
   SIGNUP ROUTE
========================= */

router.post("/signup", async (req, res) => {
  try {
    const { clinic_name, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newClinic = await pool.query(
      "INSERT INTO clinics (clinic_name, email, password) VALUES ($1,$2,$3) RETURNING *",
      [clinic_name, email, hashedPassword]
    );

    res.json({
      message: "Signup successful",
      clinic: newClinic.rows[0].clinic_name
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/* =========================
   LOGIN ROUTE
========================= */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const clinic = await pool.query(
      "SELECT * FROM clinics WHERE email = $1",
      [email]
    );

    if (clinic.rows.length === 0) {
      return res.status(400).json({ message: "Clinic not found" });
    }

    const validPassword = await bcrypt.compare(
      password,
      clinic.rows[0].password
    );

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // 🔥 FIX: use ENV secret (same as middleware)
    const token = jwt.sign(
      { clinic_id: clinic.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      message: "Login successful",
      clinic: clinic.rows[0].clinic_name,
      token: token
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;