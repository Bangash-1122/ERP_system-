import { purchaseService } from '../services/purchase.service.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const purchaseController = {
    getPurchases: asyncHandler(async (req, res) => {
        const data = await purchaseService.getPurchases(req.query);
        return ok(res, data);
    }),

    getPurchaseById: asyncHandler(async (req, res) => {
        const data = await purchaseService.getPurchaseById(req.params.id);
        if (!data) {
            throw ApiError.notFound('Purchase record not found');
        }
        return ok(res, data);
    }),

    createPurchase: asyncHandler(async (req, res) => {
        const data = await purchaseService.createPurchase({
            ...req.body,
            createdBy: req.user?.name || 'Admin'
        });
        return ok(res, data, 'Purchase saved successfully', 201);
    }),

    updatePurchase: asyncHandler(async (req, res) => {
        const data = await purchaseService.updatePurchase(req.params.id, req.body);
        if (!data) {
            throw ApiError.notFound('Purchase record not found');
        }
        return ok(res, data, 'Purchase updated successfully');
    }),

    postPurchase: asyncHandler(async (req, res) => {
        const data = await purchaseService.postPurchase(req.params.id, req.user?.name);
        return ok(res, data, 'Purchase posted to inventory & accounting');
    }),

    getReturns: asyncHandler(async (req, res) => {
        const data = await purchaseService.getReturns();
        return ok(res, data);
    }),

    createReturn: asyncHandler(async (req, res) => {
        const data = await purchaseService.createReturn({
            ...req.body,
            createdBy: req.user?.name || 'Admin'
        });
        return ok(res, data, 'Purchase return processed successfully', 201);
    })
};

export default purchaseController;
