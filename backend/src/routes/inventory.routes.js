import express from 'express';
import { inventoryController } from '../controllers/inventory.controller.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();
router.use(auth);

// Stock
router.get('/stock', inventoryController.getStock);
router.get('/movements', inventoryController.getMovements);

// Transfers
router.get('/transfers', inventoryController.getTransfers);
router.post('/transfers', inventoryController.createTransfer);
router.patch('/transfers/:id/status', inventoryController.updateTransferStatus);

// Adjustments
router.get('/adjustments', inventoryController.getAdjustments);
router.post('/adjustments', inventoryController.createAdjustment);

// Damages
router.get('/damages', inventoryController.getDamages);
router.post('/damages', inventoryController.createDamage);

export default router;
