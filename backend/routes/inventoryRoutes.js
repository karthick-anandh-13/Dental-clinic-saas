const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const inventoryController = require("../controllers/inventoryController");

router.get("/", authMiddleware, inventoryController.getInventoryItems);
router.post("/", authMiddleware, inventoryController.createInventoryItem);
router.post("/:id/restock", authMiddleware, inventoryController.restockInventoryItem);

module.exports = router;
