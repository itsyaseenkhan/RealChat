import nodemailer from "nodemailer";

const SendEmail = async ({ email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD, 
    },
  });

  await transporter.sendMail({
    from: `"RealChat Support" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject,
    html: message,
  });
};

export default SendEmail;
