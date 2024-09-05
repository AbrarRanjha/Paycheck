const { Router } =require ('express');
const errorLogsController =require ('./controller.js');

const router = Router();

router.get('/:id', errorLogsController.getErrorLogsById);
router.get('/', errorLogsController.getErrorLogs);

// You can define more routes related to users here
module.exports = router