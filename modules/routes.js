/* eslint-disable no-undef */
const { Router } = require('express');
const userRoutes = require('./User/index.js');
const uploadRoutes = require('./upload/index.js');
const saleDataRoutes = require('./SaleData/index.js');
const refundRoutes = require('./RefundPayment/index.js');
const earlyPaymentRoutes = require('./EarlyPayment/index.js');
const Payout = require('./Payouts/index.js');
const CommissionSplit = require('./CommissionSplit/index.js');
const EmployeeReports = require('./EmployeeReports/index.js');
const ErrorLogs = require('./ErrorLogs/index.js');
const router = Router();

router.use('/user', userRoutes);
router.use('/upload', uploadRoutes);
router.use('/saleData', saleDataRoutes);
router.use('/refund', refundRoutes);
router.use('/earlyPayment', earlyPaymentRoutes);
router.use('/payouts', Payout);
router.use('/commissionSplits', CommissionSplit);
router.use('/employeeReports', EmployeeReports);
router.use('/earlyPayment', earlyPaymentRoutes);
router.use('/errorLogs', ErrorLogs);

module.exports = router;