import path from 'path';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import { sendEmail } from './emailService.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const sendOtpEmail = async (name, email, otpCode) => {
  const subject = 'OTP Verification Email';
  const templatePath = path.join(
    __dirname,
    '../utils/otpEmail.ejs'
  );
  const html = await ejs.renderFile(templatePath, { name, otpCode, email });
  await sendEmail(email, subject, html);
};
