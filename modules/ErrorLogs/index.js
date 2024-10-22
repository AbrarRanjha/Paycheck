const { Router } = require('express');
const errorLogsController = require('./controller.js');

const router = Router();

// router.get('/:id', errorLogsController.getErrorLogsById);
router.put('/:uploadId', errorLogsController.updateErrorLogsById);
router.get('/:uploadId', errorLogsController.getErrorLogs);
router.post('/all/:uploadId', errorLogsController.getAllErrorLogs);
router.post('/validation/:uploadId', errorLogsController.getErrorLogsWithSaleData);

// You can define more routes related to users here
module.exports = router;
