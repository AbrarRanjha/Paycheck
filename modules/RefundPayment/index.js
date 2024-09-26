/* eslint-disable no-undef */

const { Router } = require('express');
const RefundPaymentController = require('./controller.js');
const {
  authenticate,
  adminAuthenticate,
} = require('../../utils/middleware.js');

const router = Router();

router.post(
  '/request',
  // authenticate,
  RefundPaymentController.createRefundPaymentRequest
);
router.post(
  '/verifyByAdmin/:id',
  // adminAuthenticate,
  RefundPaymentController.approveOrRejectRefundPaymentById
);
router.get('/:id', RefundPaymentController.getRefundPaymentById);
router.get('/', RefundPaymentController.getRefundPayment);

module.exports = router;
