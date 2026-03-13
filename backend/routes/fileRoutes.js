const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const fileController = require("../controllers/fileController");

router.post(
 "/upload",
 authMiddleware,
 upload.single("file"),
 fileController.uploadFile
);

router.get(
 "/:patient_id",
 authMiddleware,
 fileController.getPatientFiles
);

module.exports = router;