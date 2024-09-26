const { Router } =require ('express');
const dashboardController =require ('./controller.js');

const router = Router();

router.get('/companyCommission', dashboardController.calculateFCICommission);
router.post('/totalSale', dashboardController.totalGrossFCI);
router.get('/topPlans', dashboardController.topPlans);
router.get('/topAdvisors', dashboardController.topAdvisors);
router.get('/pendingEarlyPayment', dashboardController.pendingEarlyPayment);
router.get('/approvedEarlyPayment', dashboardController.approveEarlyPayment);
router.get('/pendingRefundPayment', dashboardController.pendingRefundPayment);
router.get('/approvedRefundPayment', dashboardController.approveRefundPayment);

// You can define more routes related to users here
module.exports = router