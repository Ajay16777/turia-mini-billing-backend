import jwt from 'jsonwebtoken';
import { tokenConfig } from '../config.js';
import { UnauthorizedError } from '../errorHandler.js';

export const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return next(new UnauthorizedError('Missing authorization header'));

    const token = authHeader.split(' ')[1];
    if (!token) return next(new UnauthorizedError('Missing token'));

    try {
        const decoded = jwt.verify(token, tokenConfig.LOGIN_TOKEN_SECRET);
        req.user = decoded; // { email, role }
        next();
    } catch (err) {
        return next(new UnauthorizedError('Invalid or expired token'));
    }
};

export const authorize = (roles = []) => (req, res, next) => {
    if (!roles.includes(req.user.role)) return next(new UnauthorizedError('Forbidden'));
    next();
};
