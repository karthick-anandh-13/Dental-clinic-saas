const pool = require("../config/db");
const bcrypt = require("bcrypt");
const apiResponse = require("../utils/apiResponse");
const auditService = require("../services/auditService");

/* =========================
   CREATE USER
========================= */

exports.createUser = async (req, res, next) => {

  try {

    const clinic_id = req.clinic.clinic_id;

    const { name, email, password } = req.body;

    /* CHECK IF USER ALREADY EXISTS */

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1 AND clinic_id = $2",
      [email, clinic_id]
    );

    if (existingUser.rows.length > 0) {
      return apiResponse.error(res, "User already exists", 400);
    }

    /* HASH PASSWORD */

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    /* CREATE USER */

    const newUser = await pool.query(
      `INSERT INTO users (clinic_id, name, email, password)
       VALUES ($1,$2,$3,$4)
       RETURNING id, name, email`,
      [clinic_id, name, email, hashedPassword]
    );

    /* AUDIT LOG */

    await auditService.logAction(
      clinic_id,
      req.user?.id || null,
      "CREATE",
      "USER",
      newUser.rows[0].id
    );

    return apiResponse.success(
      res,
      newUser.rows[0],
      "User created successfully"
    );

  } catch (err) {

    next(err);

  }

};
