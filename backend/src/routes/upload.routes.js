import express from 'express';
import { uploadController } from '../controllers/upload.controller.js';
import {
    uploadSingle,
    uploadMultiple,
    uploadProductImage,
    uploadAvatar,
    uploadDocument
} from '../middlewares/upload.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

// Protected upload routes
router.use(auth);

// Generic single and multiple uploads
router.post('/single', uploadSingle('file', 'general'), uploadController.uploadSingle);
router.post('/multiple', uploadMultiple('files', 10, 'general'), uploadController.uploadMultiple);

// Specialized uploads
router.post('/product-image', uploadProductImage('image'), uploadController.uploadProductImage);
router.post('/document', uploadDocument('document'), uploadController.uploadDocument);
router.post('/avatar', uploadAvatar('avatar'), uploadController.uploadAvatar);

export default router;
