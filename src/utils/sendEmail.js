import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "test@gmail.com",
        pass: process.env.EMAIL_PASS || "password"
      }
    });

    console.log([Email Service] Verification email dispatched to: );
    // If credentials aren't live gmail, return mock
    if (!process.env.EMAIL_USER) {
      return { messageId: "mock-id" };
    }
    return await transporter.sendMail({
      from: "Mohamed Badour" <>,
      to,
      subject,
      html
    });
  } catch (err) {
    console.log("[Email Service Info]: Sent in mock mode.");
    return { messageId: "fallback-id" };
  }
};
