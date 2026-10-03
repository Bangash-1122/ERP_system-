import { accountingService } from '../services/accounting.service.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const accountingController = {
    // Chart of Accounts
    getAccounts: asyncHandler(async (req, res) => {
        const data = await accountingService.getAccounts();
        return ok(res, data);
    }),

    createAccount: asyncHandler(async (req, res) => {
        const data = await accountingService.createAccount(req.body);
        return ok(res, data, 'Account created in Chart of Accounts', 201);
    }),

    updateAccount: asyncHandler(async (req, res) => {
        const data = await accountingService.updateAccount(req.params.id, req.body);
        return ok(res, data, 'Account updated successfully');
    }),

    deleteAccount: asyncHandler(async (req, res) => {
        await accountingService.deleteAccount(req.params.id);
        return ok(res, null, 'Account deleted successfully');
    }),

    // Vouchers
    getVouchers: asyncHandler(async (req, res) => {
        const data = await accountingService.getVouchers(req.query);
        return ok(res, data);
    }),

    createVoucher: asyncHandler(async (req, res) => {
        const data = await accountingService.createVoucher({
            ...req.body,
            createdBy: req.user?.name || 'Admin'
        });
        return ok(res, data, 'Voucher generated successfully', 201);
    }),

    // General Ledger
    getLedgerEntries: asyncHandler(async (req, res) => {
        const data = await accountingService.getLedgerEntries(req.query);
        return ok(res, data);
    })
};

export default accountingController;
