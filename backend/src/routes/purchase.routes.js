import express from 'express';
import { purchaseController } from '../controllers/purchase.controller.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();
router.use(auth);

router.get('/', purchaseController.getPurchases);
router.get('/returns/all', purchaseController.getReturns);
router.post('/returns', purchaseController.createReturn);
router.get('/:id', purchaseController.getPurchaseById);
router.post('/', purchaseController.createPurchase);
router.put('/:id', purchaseController.updatePurchase);
router.patch('/:id/post', purchaseController.postPurchase);

export default router;
