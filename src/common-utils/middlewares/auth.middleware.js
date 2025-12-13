import jwt from 'jsonwebtoken';
import { tokenConfig } from '../config.js';
import { UnauthorizedError } from '../errorHandler.js';

export const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return next(new UnauthorizedError('Missing authorization header'));

    const token = authHeader.split(' ')[1];
    if (!token) return next(new UnauthorizedError('Missing token'));

    try {
        const decoded = jwt.verify(token, tokenConfig.JWT_SECRET);
        if (req.requestDetails.requestBody) {
            req.requestDetails.requestBody.currentUser = decoded; // { email, role }
        } else {
            req.requestDetails.requestBody = { currentUser: decoded };
        }
        next();
    } catch (err) {
        return next(new UnauthorizedError('Invalid or expired token'));
    }
};

export const authorize = (roles = []) => (req, res, next) => {
    if (!roles.includes(req.user.role)) return next(new UnauthorizedError('Forbidden'));
    next();
};
