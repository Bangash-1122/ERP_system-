import { ApiError } from '../utils/ApiError.js';
import multer from 'multer';
import { env } from '../config/env.js';

/**
 * 404 Route Not Found Middleware
 */
export function notFound(req, res, next) {
    const error = new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`);
    next(error);
}

/**
 * Centralized Global Error Handler Middleware
 */
export function errorHandler(err, req, res, next) {
    let error = err;

    // Handle Multer Errors
    if (err instanceof multer.MulterError) {
        let message = `File upload error: ${err.message}`;
        if (err.code === 'LIMIT_FILE_SIZE') {
            message = 'File size limit exceeded (Max 10MB allowed)';
        } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            message = `Unexpected field uploaded: ${err.field}`;
        }
        error = new ApiError(400, message, [err]);
    }
    // Handle Mongoose Validation Error
    else if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors || {}).map((e) => ({
            field: e.path,
            message: e.message
        }));
        error = new ApiError(400, 'Database Validation Error', errors);
    }
    // Handle Mongoose Duplicate Key Error (E11000)
    else if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        const value = err.keyValue ? err.keyValue[field] : '';
        const message = `Duplicate value entered for '${field}': ${value}. It must be unique.`;
        error = new ApiError(409, message);
    }
    // Handle Mongoose Invalid ObjectId (CastError)
    else if (err.name === 'CastError') {
        const message = `Invalid identifier format: ${err.value}`;
        error = new ApiError(400, message);
    }
    // Handle JWT Errors
    else if (err.name === 'JsonWebTokenError') {
        error = new ApiError(401, 'Invalid authentication token');
    } else if (err.name === 'TokenExpiredError') {
        error = new ApiError(401, 'Authentication token has expired. Please log in again.');
    }
    // Handle General Non-ApiError
    else if (!(error instanceof ApiError)) {
        const statusCode = err.statusCode || err.status || 500;
        const message = err.message || 'Internal Server Error';
        error = new ApiError(statusCode, message, err.errors || [], err.stack);
    }

    const response = {
        success: false,
        statusCode: error.statusCode || 500,
        message: error.message || 'Internal Server Error',
        ...(error.errors && error.errors.length > 0 && { errors: error.errors }),
        ...(env.NODE_ENV === 'development' && { stack: error.stack })
    };

    if (error.statusCode >= 500) {
        console.error(' [SERVER ERROR]:', err);
    }

    res.status(error.statusCode || 500).json(response);
}