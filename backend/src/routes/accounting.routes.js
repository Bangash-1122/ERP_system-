import express from 'express';
import { accountingController } from '../controllers/accounting.controller.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();
router.use(auth);

// Chart of Accounts
router.get('/accounts', accountingController.getAccounts);
router.post('/accounts', accountingController.createAccount);
router.put('/accounts/:id', accountingController.updateAccount);
router.delete('/accounts/:id', accountingController.deleteAccount);

// Vouchers
router.get('/vouchers', accountingController.getVouchers);
router.post('/vouchers', accountingController.createVoucher);

// General Ledger
router.get('/ledger', accountingController.getLedgerEntries);

export default router;
