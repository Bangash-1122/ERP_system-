import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ApiError } from '../utils/ApiError.js';

// Base uploads root directory
const UPLOAD_ROOT = path.resolve(process.cwd(), 'uploads');

// Ensure upload directories exist
const ensureDirExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// Configure dynamic disk storage based on folder destination
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Allow dynamic subfolder via req.uploadSubfolder or fallback
        const subfolder = req.uploadSubfolder || 'general';
        const targetDir = path.join(UPLOAD_ROOT, subfolder);
        ensureDirExists(targetDir);
        cb(null, targetDir);
    },
    filename: (req, file, cb) => {
        // Sanitize and create unique filename
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname).toLowerCase();
        const cleanBaseName = path
            .basename(file.originalname, ext)
            .replace(/[^a-zA-Z0-9_-]/g, '_')
            .substring(0, 50);
        cb(null, `${cleanBaseName}-${uniqueSuffix}${ext}`);
    }
});

// Allowed file types filter
const fileFilter = (allowedMimes) => (req, file, cb) => {
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new ApiError(
                400,
                `Unsupported file format '${file.mimetype}'. Allowed types: ${allowedMimes.join(', ')}`
            ),
            false
        );
    }
};

const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const DOC_MIMES = [
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
];
const ALL_ALLOWED_MIMES = [...IMAGE_MIMES, ...DOC_MIMES];

// Base multer instance (10MB limit)
const createUploader = (allowedMimes = ALL_ALLOWED_MIMES, maxSizeMB = 10) => {
    return multer({
        storage,
        limits: {
            fileSize: maxSizeMB * 1024 * 1024
        },
        fileFilter: fileFilter(allowedMimes)
    });
};

const generalUpload = createUploader(ALL_ALLOWED_MIMES, 10);
const imageUpload = createUploader(IMAGE_MIMES, 5);
const documentUpload = createUploader(DOC_MIMES, 25);

/**
 * Middleware generators for flexible controller integration
 */
export const uploadSingle = (fieldName = 'file', subfolder = 'general') => {
    return (req, res, next) => {
        req.uploadSubfolder = subfolder;
        generalUpload.single(fieldName)(req, res, next);
    };
};

export const uploadMultiple = (fieldName = 'files', maxCount = 10, subfolder = 'general') => {
    return (req, res, next) => {
        req.uploadSubfolder = subfolder;
        generalUpload.array(fieldName, maxCount)(req, res, next);
    };
};

export const uploadProductImage = (fieldName = 'image') => {
    return (req, res, next) => {
        req.uploadSubfolder = 'products';
        imageUpload.single(fieldName)(req, res, next);
    };
};

export const uploadAvatar = (fieldName = 'avatar') => {
    return (req, res, next) => {
        req.uploadSubfolder = 'avatars';
        imageUpload.single(fieldName)(req, res, next);
    };
};

export const uploadDocument = (fieldName = 'document') => {
    return (req, res, next) => {
        req.uploadSubfolder = 'documents';
        documentUpload.single(fieldName)(req, res, next);
    };
};

export default {
    uploadSingle,
    uploadMultiple,
    uploadProductImage,
    uploadAvatar,
    uploadDocument
};
