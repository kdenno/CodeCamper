const nodemailer = require("nodemailer");
const asyncHandler = require("../middleware/asyncHandler");

const EmailSender = asyncHandler(async (options) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // send mail with defined transport object
  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: process.subject,
    text: options.message,
  };
  const info = transporter.sendMail(message);
  console.log("Message sent: %s", info.messageId);
});

module.exports = EmailSender;