import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ok } from '../utils/apiResponse.js';

/**
 * Format file metadata for API response
 */
const formatFileResponse = (req, file) => {
    const subfolder = req.uploadSubfolder || 'general';
    const relativePath = `/uploads/${subfolder}/${file.filename}`;
    const fullUrl = `${req.protocol}://${req.get('host')}${relativePath}`;

    return {
        originalName: file.originalname,
        fileName: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        path: relativePath,
        url: fullUrl
    };
};

export const uploadController = {
    // Single file upload
    uploadSingle: asyncHandler(async (req, res) => {
        if (!req.file) {
            throw ApiError.badRequest('No file uploaded. Please provide a valid file.');
        }
        const fileData = formatFileResponse(req, req.file);
        return ok(res, fileData, 'File uploaded successfully', 201);
    }),

    // Multiple files upload
    uploadMultiple: asyncHandler(async (req, res) => {
        if (!req.files || req.files.length === 0) {
            throw ApiError.badRequest('No files uploaded. Please provide one or more files.');
        }
        const filesData = req.files.map((file) => formatFileResponse(req, file));
        return ok(
            res,
            { count: filesData.length, files: filesData },
            'Files uploaded successfully',
            201
        );
    }),

    // Product Image upload
    uploadProductImage: asyncHandler(async (req, res) => {
        if (!req.file) {
            throw ApiError.badRequest('No image file provided.');
        }
        const fileData = formatFileResponse(req, req.file);
        return ok(res, fileData, 'Product image uploaded successfully', 201);
    }),

    // Document / Invoice Attachment upload
    uploadDocument: asyncHandler(async (req, res) => {
        if (!req.file) {
            throw ApiError.badRequest('No document provided.');
        }
        const fileData = formatFileResponse(req, req.file);
        return ok(res, fileData, 'Document uploaded successfully', 201);
    }),

    // Avatar upload
    uploadAvatar: asyncHandler(async (req, res) => {
        if (!req.file) {
            throw ApiError.badRequest('No avatar image provided.');
        }
        const fileData = formatFileResponse(req, req.file);
        return ok(res, fileData, 'Avatar uploaded successfully', 201);
    })
};

export default uploadController;
