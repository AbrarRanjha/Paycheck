const { Router } = require('express');
const errorLogsController = require('./controller.js');

const router = Router();

router.get('/:id', errorLogsController.getErrorLogsById);
router.put('/', errorLogsController.updateErrorLogsById);
router.get('/', errorLogsController.getErrorLogs);
router.post('/validation', errorLogsController.getErrorLogsWithSaleData);

// You can define more routes related to users here
module.exports = router;
