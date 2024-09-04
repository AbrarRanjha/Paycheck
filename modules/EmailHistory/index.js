import { Router } from 'express';
import emailHistoryController from './controller.js';

const router = Router();

router.get('/:id', emailHistoryController.getEmailHistoryById);


export default router;