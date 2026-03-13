const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

router.post("/", authMiddleware, userController.createUser);

module.exports = router;