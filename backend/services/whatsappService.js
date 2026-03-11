const twilio = require("twilio");

const client = new twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

exports.sendInvoice = async (phone, fileUrl) => {

  await client.messages.create({
    from: "whatsapp:+14155238886",
    to: `whatsapp:${phone}`,
    body: "Your dental invoice",
    mediaUrl: [fileUrl]
  });

};