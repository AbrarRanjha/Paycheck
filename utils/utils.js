/* eslint-disable no-undef */
const path = require('path');
const ejs = require('ejs');
const { sendEmail } = require('./emailService.js');

// __filename and __dirname are automatically available in CommonJS
const sendOtpEmail = async (name, email, otpCode) => {
  const subject = 'OTP Verification Email';
  const templatePath = path.join(__dirname, '../utils/otpEmail.ejs');

  const html = await ejs.renderFile(templatePath, { name, otpCode, email });

  await sendEmail(email, subject, html);
};

// Export the sendOtpEmail function
module.exports = { sendOtpEmail };
