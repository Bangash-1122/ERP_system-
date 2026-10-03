import express from 'express';
import { orgController } from '../controllers/org.controller.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();
router.use(auth);

// Branches
router.get('/branches', orgController.getBranches);
router.post('/branches', orgController.createBranch);
router.put('/branches/:id', orgController.updateBranch);
router.delete('/branches/:id', orgController.deleteBranch);

// Warehouses
router.get('/warehouses', orgController.getWarehouses);
router.post('/warehouses', orgController.createWarehouse);
router.put('/warehouses/:id', orgController.updateWarehouse);
router.delete('/warehouses/:id', orgController.deleteWarehouse);

// Shops
router.get('/shops', orgController.getShops);
router.post('/shops', orgController.createShop);
router.put('/shops/:id', orgController.updateShop);
router.delete('/shops/:id', orgController.deleteShop);

// Currencies
router.get('/currencies', orgController.getCurrencies);
router.post('/currencies', orgController.createCurrency);
router.put('/currencies/:id', orgController.updateCurrency);
router.delete('/currencies/:id', orgController.deleteCurrency);

export default router;
