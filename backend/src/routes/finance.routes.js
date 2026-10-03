import express from 'express';
import { financeController } from '../controllers/finance.controller.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();
router.use(auth);

// Payments
router.get('/payments', financeController.getPayments);
router.post('/payments', financeController.createPayment);

// Receipts
router.get('/receipts', financeController.getReceipts);
router.post('/receipts', financeController.createReceipt);

// Expenses
router.get('/expenses', financeController.getExpenses);
router.post('/expenses', financeController.createExpense);

export default router;
