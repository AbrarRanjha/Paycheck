/* eslint-disable no-undef */

const { Router } = require('express');
const EmployeeController = require('./controller.js');
const { upload } = require('../../utils.js');

const router = Router();

router.post('/register', EmployeeController.createEmployeeController);
router.put(
  '/updateProfile/:id',
  upload.single('file'),
  EmployeeController.updateProfile
);
router.post(`/login`, EmployeeController.loginUser);
router.post(`/change-password`, EmployeeController.changePassword);
router.post(`/forget-password`, EmployeeController.requestOTP);
router.post(`/verify-otp`, EmployeeController.verifyOTP);
router.post(`/set-password`, EmployeeController.resetPassword);
router.get(`/get-all-users`, EmployeeController.getAllManagers);
router.put(
  '/employee/:id/permissions',
  EmployeeController.updateEmployeePermissions
);
router.get('/:id', EmployeeController.getEmployeeById);

module.exports = router;
