import { reportService } from '../services/report.service.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const reportController = {
    getDashboardKpis: asyncHandler(async (req, res) => {
        const data = await reportService.getDashboardKpis(req.query);
        return ok(res, data);
    }),

    getSalesReport: asyncHandler(async (req, res) => {
        const data = await reportService.getSalesReport(req.query);
        return ok(res, data);
    }),

    getPurchaseReport: asyncHandler(async (req, res) => {
        const data = await reportService.getPurchaseReport(req.query);
        return ok(res, data);
    }),

    getInventoryReport: asyncHandler(async (req, res) => {
        const data = await reportService.getInventoryReport(req.query);
        return ok(res, data);
    }),

    getProfitLossReport: asyncHandler(async (req, res) => {
        const data = await reportService.getProfitLossReport();
        return ok(res, data);
    }),

    getBalanceSheet: asyncHandler(async (req, res) => {
        const data = await reportService.getBalanceSheet();
        return ok(res, data);
    })
};

export default reportController;
