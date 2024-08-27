
import { Router } from 'express';
import EmployeeController from './controller.js';

const router = Router();

router.post('/register', EmployeeController.createEmployeeController);
router.get('/:id', EmployeeController.getEmployeeByIdController);

export default router;
