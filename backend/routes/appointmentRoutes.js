const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const appointmentController = require("../controllers/appointmentController");

/* CREATE APPOINTMENT */

router.post("/", authMiddleware, appointmentController.createAppointment);

/* GET APPOINTMENTS */

router.get("/", authMiddleware, appointmentController.getAppointments);

/* DELETE APPOINTMENT */

router.delete("/:id", authMiddleware, appointmentController.deleteAppointment);

module.exports = router;