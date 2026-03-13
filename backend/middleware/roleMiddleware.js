const pool = require("../config/db");

const authorizeRoles = (...allowedRoles) => {

  return async (req, res, next) => {

    try {

      const user_id = req.clinic.user_id;

      const roles = await pool.query(
        `SELECT r.name
         FROM roles r
         JOIN user_roles ur ON r.id = ur.role_id
         WHERE ur.user_id = $1`,
        [user_id]
      );

      const userRoles = roles.rows.map(r => r.name);

      const hasPermission = userRoles.some(role =>
        allowedRoles.includes(role)
      );

      if (!hasPermission) {
        return res.status(403).json({
          message: "Access denied"
        });
      }

      next();

    } catch (err) {
      next(err);
    }

  };

};

module.exports = authorizeRoles;