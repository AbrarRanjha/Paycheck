const { Router } =require ('express');
const PayoutController =require ('./controller.js');

const router = Router();

router.get('/:id', PayoutController.getPayoutById);
router.get('/', PayoutController.getAdvisorPayoutPeriodically);
router.put('/updatePayout', PayoutController.updatePayout);

module.exports = router;