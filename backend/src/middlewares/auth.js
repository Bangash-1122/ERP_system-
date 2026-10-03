import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function auth(req, res, next) {
    const h = req.headers.authorization;
    if (!h?.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }
    try {
        req.user = jwt.verify(h.slice(7), env.JWT_SECRET);
        next();
    } catch {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
}

export const requirePermission = (permission) => (req, res, next) => {
    if (req.user?.role === 'Administrator' || req.user?.permissions?.includes(permission)) {
        return next();
    }
    return res.status(403).json({
        success: false,
        message: 'Permission denied'
    });
};