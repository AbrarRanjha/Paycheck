
import { Router } from 'express';
import EmployeeController from './controller.js';
import { upload } from '../../utils.js';

const router = Router();

router.post('/register', EmployeeController.createEmployeeController);
router.get('/:id', EmployeeController.getEmployeeByIdController);
router.put('/updateProfile/:id',upload.single('file'), EmployeeController.updateProfile);
router.post(`/login`, EmployeeController.loginUser);
router.post(`/change-password`, EmployeeController.changePassword);
router.post(`/forget-password`, EmployeeController.requestOTP);
router.post(`/verify-otp`, EmployeeController.verifyOTP);
router.post(`/set-password`, EmployeeController.resetPassword);

export default router;
