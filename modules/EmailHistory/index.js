const Router = require('express');
const emailHistoryController = require('./controller.js');

const router = Router();

router.get('/:id', emailHistoryController.getEmailHistoryById);
router.get('/', emailHistoryController.getAllEmailHistories);
router.post('/', emailHistoryController.createEmailHistory);
router.put('/:id', emailHistoryController.updateEmailHistory);
router.delete('/:id', emailHistoryController.deleteEmailHistory);

module.exports = router;
