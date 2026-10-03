import express from 'express';
import { productController } from '../controllers/product.controller.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();
router.use(auth);

// Products
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Categories
router.get('/categories/all', productController.getCategories);
router.post('/categories', productController.createCategory);
router.put('/categories/:id', productController.updateCategory);
router.delete('/categories/:id', productController.deleteCategory);

// Quantity Units
router.get('/units/all', productController.getUnits);
router.post('/units', productController.createUnit);
router.delete('/units/:id', productController.deleteUnit);

// Packing Units
router.get('/packing/all', productController.getPackingUnits);
router.post('/packing', productController.createPackingUnit);
router.delete('/packing/:id', productController.deletePackingUnit);

export default router;
