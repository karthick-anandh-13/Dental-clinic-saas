const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.generateInvoicePDF = (invoiceData) => {

  const doc = new PDFDocument();

  const filePath = path.join(
    __dirname,
    "../invoices",
    `invoice_${invoiceData.id}.pdf`
  );

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("Dental Clinic Invoice", { align: "center" });

  doc.moveDown();

  doc.fontSize(12).text(`Patient: ${invoiceData.patient_name}`);
  doc.text(`Treatment: ${invoiceData.treatment_type}`);
  doc.text(`Amount: $${invoiceData.amount}`);
  doc.text(`Date: ${new Date(invoiceData.created_at).toLocaleDateString()}`);
  doc.text(`Payment Method: ${invoiceData.payment_method}`);

  doc.end();

  return filePath;

};