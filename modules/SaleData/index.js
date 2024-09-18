/* eslint-disable no-undef */
const { Router } = require('express');
const uploadController = require('./controller.js');

const router = Router();

router.get('/:id', uploadController.getSaleDataById);
router.get('/', uploadController.getSaleData);
router.put('/:id', uploadController.updateSaleDataById);

// You can define more routes related to users here

module.exports = router;
