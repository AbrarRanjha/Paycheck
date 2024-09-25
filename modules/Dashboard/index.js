const { Router } =require ('express');
const dashboardController =require ('./controller.js');

const router = Router();

router.get('/unvalidateInvoices', dashboardController.unValidatedInvoice);

// You can define more routes related to users here
module.exports = router