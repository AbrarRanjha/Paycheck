
import { Router } from 'express';
import uploadController from './controller.js';
import {upload} from '../../utils.js'

const router = Router();

router.get('/:id', uploadController.getUploadByIdController);
router.post('/fileUpload',upload.single('file'), uploadController.uploadCSVFile);


export default router;
