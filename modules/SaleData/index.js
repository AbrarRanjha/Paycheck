import { Router } from 'express';
import uploadController from './controller.js';

const router = Router();

router.get('/:id', uploadController.getSaleDataById);
router.get('/', uploadController.getSaleData);

// You can define more routes related to users here

export default router