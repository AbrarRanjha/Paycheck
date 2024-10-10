/* eslint-disable no-undef */

const { Router } = require('express');
const EarlyPaymentController = require('./controller.js');
const {
  authenticate,
  adminAuthenticate,
} = require('../../utils/middleware.js');

const router = Router();

router.post(
  '/request',
  authenticate,
  EarlyPaymentController.createEarlyPaymentRequest
);
router.post(
  '/verifyByAdmin/:id',
  adminAuthenticate,
  EarlyPaymentController.approveOrRejectEarlyPaymentById
);
router.get('/:id', EarlyPaymentController.getEarlyPaymentById);
router.get('/', EarlyPaymentController.getEarlyPayment);
router.post('/all', EarlyPaymentController.getAllEarlyPayment);

module.exports = router;
