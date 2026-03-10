const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const treatmentController = require("../controllers/treatmentController");


/* CREATE TREATMENT */

router.post("/", authMiddleware, treatmentController.createTreatment);


/* GET TREATMENTS */

router.get("/", authMiddleware, treatmentController.getTreatments);


module.exports = router;