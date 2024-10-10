/* eslint-disable no-undef */
const path = require('path');
const ejs = require('ejs');
const { sendEmail } = require('./emailService.js');
const Payout = require('../modules/Payouts/model.js');

// __filename and __dirname are automatically available in CommonJS
const sendOtpEmail = async (name, email, otpCode) => {
  const subject = 'OTP Verification Email';
  const templatePath = path.join(__dirname, '../utils/otpEmail.ejs');

  const html = await ejs.renderFile(templatePath, { name, otpCode, email });

  await sendEmail(email, subject, html);
};
const changePayoutSplitValue = async (
  previousSplitAmount,
  newSplitAmount,
  payoutRecord,
  previousGrossValue,
  newGrossValue
) => {
  let newSplitValue,
    netPayout,
    totalGrossFCI = payoutRecord.totalGrossFCI;
  if (previousSplitAmount > newSplitAmount) {
    const difference = previousSplitAmount - newSplitAmount;
    newSplitValue = payoutRecord?.totalAdvisorSplit - difference;
    netPayout = payoutRecord?.netPayout - difference;
  } else if (previousSplitAmount < newSplitAmount) {
    const difference = newSplitAmount - previousSplitAmount;
    newSplitValue = payoutRecord?.totalAdvisorSplit + difference;
    netPayout = payoutRecord?.netPayout + difference;
  } else if (newSplitAmount == 0) {
    newSplitValue = payoutRecord?.totalAdvisorSplit - previousSplitAmount;
    netPayout = payoutRecord?.netPayout - previousSplitAmount;
  }
  if (previousGrossValue > newGrossValue) {
    const difference = previousGrossValue - newGrossValue;
    totalGrossFCI = payoutRecord?.totalGrossFCI - difference;
  } else if (previousGrossValue < newGrossValue) {
    const difference = newGrossValue - previousGrossValue;
    totalGrossFCI = payoutRecord?.totalGrossFCI + difference;
  }
  await Payout.update(
    {
      totalAdvisorSplit: newSplitValue,
      netPayout,
      totalGrossFCI,
    },
    { where: { id: payoutRecord?.id } }
  );
};

// Export the sendOtpEmail function
module.exports = { sendOtpEmail, changePayoutSplitValue };
