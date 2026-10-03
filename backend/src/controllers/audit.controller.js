import { auditService } from '../services/audit.service.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const auditController = {
    getLogs: asyncHandler(async (req, res) => {
        const data = await auditService.getLogs(req.query);
        return ok(res, data);
    }),

    logAction: asyncHandler(async (req, res) => {
        const data = await auditService.logAction({
            ...req.body,
            userName: req.user?.name || req.body.userName,
            userEmail: req.user?.email || req.body.userEmail,
            role: req.user?.role || req.body.role
        });
        return ok(res, data, 'Audit log saved successfully', 201);
    })
};

export default auditController;
