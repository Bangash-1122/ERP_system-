import { orgService } from '../services/org.service.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const orgController = {
    // Branches
    getBranches: asyncHandler(async (req, res) => {
        const data = await orgService.getBranches();
        return ok(res, data);
    }),
    createBranch: asyncHandler(async (req, res) => {
        const data = await orgService.createBranch(req.body);
        return ok(res, data, 'Branch created successfully', 201);
    }),
    updateBranch: asyncHandler(async (req, res) => {
        const data = await orgService.updateBranch(req.params.id, req.body);
        return ok(res, data, 'Branch updated successfully');
    }),
    deleteBranch: asyncHandler(async (req, res) => {
        await orgService.deleteBranch(req.params.id);
        return ok(res, null, 'Branch deleted successfully');
    }),

    // Warehouses
    getWarehouses: asyncHandler(async (req, res) => {
        const data = await orgService.getWarehouses();
        return ok(res, data);
    }),
    createWarehouse: asyncHandler(async (req, res) => {
        const data = await orgService.createWarehouse(req.body);
        return ok(res, data, 'Warehouse created successfully', 201);
    }),
    updateWarehouse: asyncHandler(async (req, res) => {
        const data = await orgService.updateWarehouse(req.params.id, req.body);
        return ok(res, data, 'Warehouse updated successfully');
    }),
    deleteWarehouse: asyncHandler(async (req, res) => {
        await orgService.deleteWarehouse(req.params.id);
        return ok(res, null, 'Warehouse deleted successfully');
    }),

    // Shops
    getShops: asyncHandler(async (req, res) => {
        const data = await orgService.getShops();
        return ok(res, data);
    }),
    createShop: asyncHandler(async (req, res) => {
        const data = await orgService.createShop(req.body);
        return ok(res, data, 'Shop created successfully', 201);
    }),
    updateShop: asyncHandler(async (req, res) => {
        const data = await orgService.updateShop(req.params.id, req.body);
        return ok(res, data, 'Shop updated successfully');
    }),
    deleteShop: asyncHandler(async (req, res) => {
        await orgService.deleteShop(req.params.id);
        return ok(res, null, 'Shop deleted successfully');
    }),

    // Currencies
    getCurrencies: asyncHandler(async (req, res) => {
        const data = await orgService.getCurrencies();
        return ok(res, data);
    }),
    createCurrency: asyncHandler(async (req, res) => {
        const data = await orgService.createCurrency(req.body);
        return ok(res, data, 'Currency created successfully', 201);
    }),
    updateCurrency: asyncHandler(async (req, res) => {
        const data = await orgService.updateCurrency(req.params.id, req.body);
        return ok(res, data, 'Currency updated successfully');
    }),
    deleteCurrency: asyncHandler(async (req, res) => {
        await orgService.deleteCurrency(req.params.id);
        return ok(res, null, 'Currency deleted successfully');
    })
};

export default orgController;
