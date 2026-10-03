import express from 'express';
import authRoutes from './auth.routes.js';
import orgRoutes from './org.routes.js';
import productRoutes from './product.routes.js';
import inventoryRoutes from './inventory.routes.js';
import partyRoutes from './party.routes.js';
import purchaseRoutes from './purchase.routes.js';
import saleRoutes from './sale.routes.js';
import accountingRoutes from './accounting.routes.js';
import financeRoutes from './finance.routes.js';
import logisticsRoutes from './logistics.routes.js';
import reportRoutes from './report.routes.js';
import auditRoutes from './audit.routes.js';
import userRoutes from './user.routes.js';
import uploadRoutes from './upload.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/org', orgRoutes);
router.use('/products', productRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/parties', partyRoutes);
router.use('/purchases', purchaseRoutes);
router.use('/sales', saleRoutes);
router.use('/accounting', accountingRoutes);
router.use('/finance', financeRoutes);
router.use('/logistics', logisticsRoutes);
router.use('/reports', reportRoutes);
router.use('/audit', auditRoutes);
router.use('/users', userRoutes);
router.use('/upload', uploadRoutes);

export default router;

