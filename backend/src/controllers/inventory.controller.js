import { inventoryService } from '../services/inventory.service.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const inventoryController = {
    getStock: asyncHandler(async (req, res) => {
        const data = await inventoryService.getStockBalances(req.query);
        return ok(res, data);
    }),

    getMovements: asyncHandler(async (req, res) => {
        const data = await inventoryService.getStockMovements(req.query);
        return ok(res, data);
    }),

    getTransfers: asyncHandler(async (req, res) => {
        const data = await inventoryService.getTransfers();
        return ok(res, data);
    }),

    createTransfer: asyncHandler(async (req, res) => {
        const data = await inventoryService.createTransfer(req.body);
        return ok(res, data, 'Warehouse transfer initiated', 201);
    }),

    updateTransferStatus: asyncHandler(async (req, res) => {
        const { status } = req.body;
        const data = await inventoryService.updateTransferStatus(
            req.params.id,
            status,
            req.user?.name
        );
        return ok(res, data, `Transfer status updated to ${status}`);
    }),

    getAdjustments: asyncHandler(async (req, res) => {
        const data = await inventoryService.getAdjustments();
        return ok(res, data);
    }),

    createAdjustment: asyncHandler(async (req, res) => {
        const data = await inventoryService.createAdjustment(req.body);
        return ok(res, data, 'Stock adjustment recorded', 201);
    }),

    getDamages: asyncHandler(async (req, res) => {
        const data = await inventoryService.getDamages();
        return ok(res, data);
    }),

    createDamage: asyncHandler(async (req, res) => {
        const data = await inventoryService.createDamage(req.body);
        return ok(res, data, 'Damage record registered', 201);
    })
};

export default inventoryController;
