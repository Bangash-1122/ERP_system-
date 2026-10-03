import express from 'express';
import { userController } from '../controllers/user.controller.js';
import { auth, requirePermission } from '../middlewares/auth.js';

const router = express.Router();
router.use(auth);

// Users
router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// Roles
router.get('/roles/all', userController.getRoles);
router.post('/roles', userController.createRole);
router.put('/roles/:id', userController.updateRole);
router.delete('/roles/:id', userController.deleteRole);

export default router;
