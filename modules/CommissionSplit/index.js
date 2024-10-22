const { Router } = require('express');
const CommissionSplitController = require('./controller.js')
const router = Router();

// router.get('/:id', CommissionSplitController.getCommissionSplitById);
router.get('/:id', CommissionSplitController.getCommissionSplit);
router.post('/all/:id', CommissionSplitController.getALLCommissionSplit);
router.put('/updateCommission', CommissionSplitController.updateCommissionSplit);

// You can define more routes related to users here
module.exports = router;