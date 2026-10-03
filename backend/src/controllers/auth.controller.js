import { authService } from '../services/auth.service.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const authController = {
    register: asyncHandler(async (req, res) => {
        const data = await authService.register(req.body);
        return ok(res, data, 'User registered successfully', 201);
    }),

    login: asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            throw ApiError.badRequest('Email and password are required');
        }
        const data = await authService.login(email, password);
        return ok(res, data, 'Login successful');
    }),

    me: asyncHandler(async (req, res) => {
        return ok(res, req.user, 'Current user profile');
    })
};

export default authController;
