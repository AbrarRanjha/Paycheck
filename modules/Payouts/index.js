const { Router } =require ('express');
const PayoutController =require ('./controller.js');

const router = Router();

router.get('/:id', PayoutController.getPayoutById);
router.get('/', PayoutController.getPayout);
router.put('/updateCommission/:id', PayoutController.updatePayout);

module.exports = router;