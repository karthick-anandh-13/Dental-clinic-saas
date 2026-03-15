const pool = require("../config/db");

exports.logAction = async (
 clinic_id,
 user_id,
 action,
 entity,
 entity_id
) => {

 try {

  await pool.query(
   `INSERT INTO audit_logs
   (clinic_id,user_id,action,entity,entity_id)
   VALUES ($1,$2,$3,$4,$5)`,
   [clinic_id,user_id,action,entity,entity_id]
  );

 } catch(err) {
  console.error("Audit log error:", err);
 }

};