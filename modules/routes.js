import { Router } from 'express';
import userRoutes from './User/index.js';
import uploadRoutes from './upload/index.js';
import saleDataRoutes from './SaleData/index.js';
import refundRoutes from './RefundPayment/index.js';
import earlyPaymentRoutes from './EarlyPayment/index.js';
import Payout from './Payouts/index.js';
import CommissionSplit from './CommissionSplit/index.js';
import EmployeeReports from './EmployeeReports/index.js';
import ErrorLogs from './ErrorLogs/index.js';
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

export default router;
