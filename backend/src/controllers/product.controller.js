import { productService } from '../services/product.service.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const productController = {
    // Products
    getProducts: asyncHandler(async (req, res) => {
        const data = await productService.getProducts(req.query);
        return ok(res, data);
    }),
    getProductById: asyncHandler(async (req, res) => {
        const data = await productService.getProductById(req.params.id);
        if (!data) {
            throw ApiError.notFound('Product not found');
        }
        return ok(res, data);
    }),
    createProduct: asyncHandler(async (req, res) => {
        const data = await productService.createProduct(req.body);
        return ok(res, data, 'Product created successfully', 201);
    }),
    updateProduct: asyncHandler(async (req, res) => {
        const data = await productService.updateProduct(req.params.id, req.body);
        if (!data) {
            throw ApiError.notFound('Product not found');
        }
        return ok(res, data, 'Product updated successfully');
    }),
    deleteProduct: asyncHandler(async (req, res) => {
        await productService.deleteProduct(req.params.id);
        return ok(res, null, 'Product deleted successfully');
    }),

    // Categories
    getCategories: asyncHandler(async (req, res) => {
        const data = await productService.getCategories();
        return ok(res, data);
    }),
    createCategory: asyncHandler(async (req, res) => {
        const data = await productService.createCategory(req.body);
        return ok(res, data, 'Category created successfully', 201);
    }),
    updateCategory: asyncHandler(async (req, res) => {
        const data = await productService.updateCategory(req.params.id, req.body);
        return ok(res, data, 'Category updated successfully');
    }),
    deleteCategory: asyncHandler(async (req, res) => {
        await productService.deleteCategory(req.params.id);
        return ok(res, null, 'Category deleted successfully');
    }),

    // Units
    getUnits: asyncHandler(async (req, res) => {
        const data = await productService.getUnits();
        return ok(res, data);
    }),
    createUnit: asyncHandler(async (req, res) => {
        const data = await productService.createUnit(req.body);
        return ok(res, data, 'Unit created successfully', 201);
    }),
    deleteUnit: asyncHandler(async (req, res) => {
        await productService.deleteUnit(req.params.id);
        return ok(res, null, 'Unit deleted successfully');
    }),

    // Packing Units
    getPackingUnits: asyncHandler(async (req, res) => {
        const data = await productService.getPackingUnits();
        return ok(res, data);
    }),
    createPackingUnit: asyncHandler(async (req, res) => {
        const data = await productService.createPackingUnit(req.body);
        return ok(res, data, 'Packing unit created successfully', 201);
    }),
    deletePackingUnit: asyncHandler(async (req, res) => {
        await productService.deletePackingUnit(req.params.id);
        return ok(res, null, 'Packing unit deleted successfully');
    })
};

export default productController;
