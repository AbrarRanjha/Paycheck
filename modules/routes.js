import { Router } from 'express';
import userRoutes from './user/index.js';
import uploadRoutes from './upload/index.js';
import saleDataRoutes from './SaleData/index.js';
import refundRoutes from './RefundPayment/index.js';
import earlyPaymentRoutes from './EarlyPayment/index.js';
const router = Router();

router.use('/user', userRoutes);
router.use('/upload', uploadRoutes);
router.use('/saleData', saleDataRoutes);
router.use('/refund', refundRoutes);
router.use('/earlyPayment', earlyPaymentRoutes);

export default router;
