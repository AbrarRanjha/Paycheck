
import { Router } from 'express';
import uploadController from './controller.js';

const router = Router();

router.get('/:id', uploadController.getSaleDataById);


export default router;
