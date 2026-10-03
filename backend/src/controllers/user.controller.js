import { userService } from '../services/user.service.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const userController = {
    // Users
    getUsers: asyncHandler(async (req, res) => {
        const data = await userService.getUsers();
        return ok(res, data);
    }),
    createUser: asyncHandler(async (req, res) => {
        const data = await userService.createUser(req.body);
        return ok(res, data, 'User created successfully', 201);
    }),
    updateUser: asyncHandler(async (req, res) => {
        const data = await userService.updateUser(req.params.id, req.body);
        return ok(res, data, 'User updated successfully');
    }),
    deleteUser: asyncHandler(async (req, res) => {
        await userService.deleteUser(req.params.id);
        return ok(res, null, 'User deleted successfully');
    }),

    // Roles
    getRoles: asyncHandler(async (req, res) => {
        const data = await userService.getRoles();
        return ok(res, data);
    }),
    createRole: asyncHandler(async (req, res) => {
        const data = await userService.createRole(req.body);
        return ok(res, data, 'Role created successfully', 201);
    }),
    updateRole: asyncHandler(async (req, res) => {
        const data = await userService.updateRole(req.params.id, req.body);
        return ok(res, data, 'Role updated successfully');
    }),
    deleteRole: asyncHandler(async (req, res) => {
        await userService.deleteRole(req.params.id);
        return ok(res, null, 'Role deleted successfully');
    })
};

export default userController;
