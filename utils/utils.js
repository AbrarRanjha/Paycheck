import { sendEmail } from "./emailService.js";

export const sendOtpEmail=async (email, otp)=>{
    const subject = "Password Reset OTP";
    const text = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
    Your OTP code is: ${otp}\n\n
    If you did not request this, please ignore this email and your password will remain unchanged.\n`;
    const html = `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
    <p>Your OTP code is: <strong>${otp}</strong></p>
    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`;

    await sendEmail(email, subject, text, html);
  }