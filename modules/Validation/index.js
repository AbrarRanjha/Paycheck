const { Router } =require ('express');
const validationController =require ('./controller.js');

const router = Router();

router.get('/:id', validationController.getValidationById);
router.get('/', validationController.getValidation);

// You can define more routes related to users here
module.exports = router