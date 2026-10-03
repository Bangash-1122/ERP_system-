import { financeService } from '../services/finance.service.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const financeController = {
    // Payments
    getPayments: asyncHandler(async (req, res) => {
        const data = await financeService.getPayments(req.query);
        return ok(res, data);
    }),
    createPayment: asyncHandler(async (req, res) => {
        const data = await financeService.createPayment({
            ...req.body,
            createdBy: req.user?.name || 'Admin'
        });
        return ok(res, data, 'Payment processed successfully', 201);
    }),

    // Receipts
    getReceipts: asyncHandler(async (req, res) => {
        const data = await financeService.getReceipts(req.query);
        return ok(res, data);
    }),
    createReceipt: asyncHandler(async (req, res) => {
        const data = await financeService.createReceipt({
            ...req.body,
            createdBy: req.user?.name || 'Admin'
        });
        return ok(res, data, 'Receipt recorded successfully', 201);
    }),

    // Expenses
    getExpenses: asyncHandler(async (req, res) => {
        const data = await financeService.getExpenses(req.query);
        return ok(res, data);
    }),
    createExpense: asyncHandler(async (req, res) => {
        const data = await financeService.createExpense({
            ...req.body,
            createdBy: req.user?.name || 'Admin'
        });
        return ok(res, data, 'Expense recorded successfully', 201);
    })
};

export default financeController;
