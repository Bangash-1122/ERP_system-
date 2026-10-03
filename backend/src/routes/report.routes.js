import express from 'express';
import { reportController } from '../controllers/report.controller.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();
router.use(auth);

router.get('/dashboard', reportController.getDashboardKpis);
router.get('/sales', reportController.getSalesReport);
router.get('/purchases', reportController.getPurchaseReport);
router.get('/inventory', reportController.getInventoryReport);
router.get('/profit-loss', reportController.getProfitLossReport);
router.get('/balance-sheet', reportController.getBalanceSheet);

export default router;
