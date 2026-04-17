const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post("/", authMiddleware, userController.createUser);
router.post(
 "/",
 authMiddleware,
 authorizeRoles("owner"),
 userController.createUser
);

router.get("/", authMiddleware, userController.getUsers);

module.exports = router;