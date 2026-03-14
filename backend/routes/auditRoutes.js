const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const pool = require("../config/db");

router.get("/", authMiddleware, async (req,res)=>{

 const clinic_id = req.clinic.clinic_id;

 const logs = await pool.query(
  "SELECT * FROM audit_logs WHERE clinic_id=$1 ORDER BY created_at DESC",
  [clinic_id]
 );

 res.json(logs.rows);

});

module.exports = router;