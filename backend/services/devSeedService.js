const pool = require("../config/db");
const bcrypt = require("bcrypt");

async function seedAdminClinic() {

  try {

    const email = "smilecare@gmail.com";
    const password = "123456";

    const existing = await pool.query(
      "SELECT * FROM clinics WHERE email=$1",
      [email]
    );

    if (existing.rows.length === 0) {

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await pool.query(
        `INSERT INTO clinics (clinic_name,email,password)
         VALUES ($1,$2,$3)`,
        ["SmileCare Dental", email, hashedPassword]
      );

      console.log("✅ Dev admin clinic created");

    } else {

      console.log("✅ Dev admin clinic already exists");

    }

  } catch (error) {

    console.error("Seed error:", error);

  }

}

module.exports = seedAdminClinic;