const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

const SMS_FROM = process.env.TWILIO_SMS_FROM || process.env.TWILIO_NUMBER;
const WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+919345664453";

exports.sendSmsNotification = async (phone, message) => {
  if (!SMS_FROM) {
    throw new Error("Twilio SMS from number is not configured");
  }

  return client.messages.create({
    from: SMS_FROM,
    to: phone,
    body: message
  });
};

exports.sendWhatsAppNotification = async (phone, message) => {
  if (!WHATSAPP_FROM) {
    throw new Error("WhatsApp from number is not configured");
  }

  return client.messages.create({
    from: WHATSAPP_FROM,
    to: `whatsapp:${phone}`,
    body: message
  });
};

exports.notifyAppointment = async (phone, patientName, dentistName, startTime) => {
  const formattedDate = new Date(startTime).toLocaleString();
  const message = `Hi ${patientName}, your appointment with ${dentistName} is scheduled for ${formattedDate}. Please arrive 10 minutes early.`;

  await Promise.all([
    exports.sendSmsNotification(phone, message),
    exports.sendWhatsAppNotification(phone, message)
  ]);
};

exports.notifyReminder = async (phone, patientName, startTime) => {
  const formattedDate = new Date(startTime).toLocaleString();
  const message = `Reminder: Hi ${patientName}, you have a dental appointment tomorrow at ${formattedDate}.`;

  await Promise.all([
    exports.sendSmsNotification(phone, message),
    exports.sendWhatsAppNotification(phone, message)
  ]);
};