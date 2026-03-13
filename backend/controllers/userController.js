const pool = require("../config/db");
const bcrypt = require("bcrypt");

/* CREATE USER */

exports.createUser = async (req, res, next) => {

  try {

    const clinic_id = req.clinic.clinic_id;

    const { name, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      `INSERT INTO users (clinic_id, name, email, password)
       VALUES ($1,$2,$3,$4)
       RETURNING id, name, email`,
      [clinic_id, name, email, hashedPassword]
    );

    res.json(newUser.rows[0]);

  } catch (err) {

    next(err);

  }

};