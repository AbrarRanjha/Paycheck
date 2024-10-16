/* eslint-disable no-undef */
const { Router } = require('express');
const uploadController = require('./controller.js');
const { upload } = require('../../utils.js');

const router = Router();

router.get('/:id', uploadController.getUploadById);
router.delete('/:id', uploadController.deleteUploadById);
router.put('/', uploadController.updateUploadById);
router.get('/', uploadController.getUploadAllFiles);
router.post('/fileUpload', upload.single('file'), uploadController.uploadCSVFile);

module.exports = router;
