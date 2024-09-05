const { Router } =require ('express');
const PayoutController =require ('./controller.js');

const router = Router();

router.get('/:id', PayoutController.getPayoutById);
router.get('/', PayoutController.getPayout);

// You can define more routes related to users here
module.exports = router;