const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const invoiceController = require("../controllers/invoiceController");


/* CREATE INVOICE */

router.post("/", authMiddleware, invoiceController.createInvoice);


/* GET INVOICES */

router.get("/", authMiddleware, invoiceController.getInvoices);


module.exports = router;