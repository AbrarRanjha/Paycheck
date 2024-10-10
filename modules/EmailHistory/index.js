const Router = require('express');
const emailHistoryController = require('./controller.js');
const {
  authenticate,
  adminAuthenticate,
} = require('../../utils/middleware.js');
const { upload } = require('../../utils.js');
const router = Router();

router.get('/:id', emailHistoryController.getEmailHistoryById);
router.get('/', authenticate, emailHistoryController.getAllEmailHistories);
router.post('/', upload.single('file'), emailHistoryController.createEmailHistory);
router.put('/:id', emailHistoryController.updateEmailHistory);
router.delete('/:id', emailHistoryController.deleteEmailHistory);

module.exports = router;
