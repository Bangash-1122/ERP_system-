import { saleService } from '../services/sale.service.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const saleController = {
    getSales: asyncHandler(async (req, res) => {
        const data = await saleService.getSales(req.query);
        return ok(res, data);
    }),

    getSaleById: asyncHandler(async (req, res) => {
        const data = await saleService.getSaleById(req.params.id);
        if (!data) {
            throw ApiError.notFound('Sales record not found');
        }
        return ok(res, data);
    }),

    createSale: asyncHandler(async (req, res) => {
        const data = await saleService.createSale({
            ...req.body,
            createdBy: req.user?.name || 'Admin'
        });
        return ok(res, data, 'Sales invoice created successfully', 201);
    }),

    updateSale: asyncHandler(async (req, res) => {
        const data = await saleService.updateSale(req.params.id, req.body);
        if (!data) {
            throw ApiError.notFound('Sales record not found');
        }
        return ok(res, data, 'Sales invoice updated successfully');
    }),

    postSale: asyncHandler(async (req, res) => {
        const data = await saleService.postSale(req.params.id, req.user?.name);
        return ok(res, data, 'Sales invoice posted to inventory & accounting');
    }),

    getReturns: asyncHandler(async (req, res) => {
        const data = await saleService.getReturns();
        return ok(res, data);
    }),

    createReturn: asyncHandler(async (req, res) => {
        const data = await saleService.createReturn({
            ...req.body,
            createdBy: req.user?.name || 'Admin'
        });
        return ok(res, data, 'Sales return recorded successfully', 201);
    })
};

export default saleController;
