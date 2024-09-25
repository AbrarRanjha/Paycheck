/* eslint-disable no-undef */
const { Router } = require('express');
const userRoutes = require('./User/index.js');
const uploadRoutes = require('./Upload/index.js');
const saleDataRoutes = require('./SaleData/index.js');
const refundRoutes = require('./RefundPayment/index.js');
const earlyPaymentRoutes = require('./EarlyPayment/index.js');
const Payout = require('./Payouts/index.js');
const ClientCommissionSplit = require('./CommissionSplit/index.js');
const EmployeeReports = require('./EmployeeReports/index.js');
const ErrorLogs = require('./ErrorLogs/index.js');
const Dashboard = require('./Dashboard/index.js');
const router = Router();

router.use('/user', userRoutes);
router.use('/upload', uploadRoutes);
router.use('/saleData', saleDataRoutes);
router.use('/refundPayment', refundRoutes);
router.use('/earlyPayment', earlyPaymentRoutes);
router.use('/payouts', Payout);
router.use('/commissionSplits',ClientCommissionSplit);
router.use('/employeeReports', EmployeeReports);
router.use('/earlyPayment', earlyPaymentRoutes);
router.use('/errorLogs', ErrorLogs);
router.use('/dashboard', Dashboard);

module.exports = router;