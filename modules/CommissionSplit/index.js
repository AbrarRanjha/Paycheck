const { Router } =require ('express');
const CommissionSplitController =require ('./controller.js')
const router = Router();

router.get('/:id', CommissionSplitController.getCommissionSplitById);
router.get('/getByTransaction', CommissionSplitController.getCommissionSplit);
router.put('/updateCommission/:id', CommissionSplitController.updateCommissionSplit);

// You can define more routes related to users here
module.exports = router;