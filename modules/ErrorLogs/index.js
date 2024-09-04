import { Router } from 'express';
import errorLogsController from './controller.js';

const router = Router();

router.get('/:id', errorLogsController.getErrorLogsById);
router.get('/', errorLogsController.getErrorLogs);

// You can define more routes related to users here

export default router