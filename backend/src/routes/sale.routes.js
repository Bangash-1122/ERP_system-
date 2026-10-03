import express from 'express';
import { saleController } from '../controllers/sale.controller.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();
router.use(auth);

router.get('/', saleController.getSales);
router.get('/returns/all', saleController.getReturns);
router.post('/returns', saleController.createReturn);
router.get('/:id', saleController.getSaleById);
router.post('/', saleController.createSale);
router.put('/:id', saleController.updateSale);
router.patch('/:id/post', saleController.postSale);

export default router;
