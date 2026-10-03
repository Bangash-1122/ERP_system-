import express from 'express';
import { auditController } from '../controllers/audit.controller.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();
router.use(auth);

router.get('/', auditController.getLogs);
router.post('/', auditController.logAction);

export default router;
