const { Router } = require('express');
const PayoutController = require('./controller.js');

const router = Router();

router.get('/:id', PayoutController.getPayoutById);
router.get('/', PayoutController.getAdvisorPayoutPeriodically);
router.post('/all', PayoutController.getAllAdvisorPayoutPeriodically);
router.put('/updatePayout', PayoutController.updatePayout);

module.exports = router;