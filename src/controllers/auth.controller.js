import commonUtils from '../common-utils/index.js';
import * as authService from '../services/auth-services/auth.service.js';

const {
    logger,
    errorUtils,
    RequestResponseHandler: rrHandler,
} = commonUtils;

const {
    InternalServerError,
    ValidationError,
    UnauthorizedError,
} = errorUtils;

/**
 * Login Controller
 * POST /v0/auth/login
 */
export const loginController = async (req, res, next) => {
    const data = req.requestDetails;
    try {
        const authResponse = await authService.login(data);
        return rrHandler.sendSuccessResponse(res, authResponse);
    } catch (err) {
        // Log error
        logger.error(
            data,
            'Error occurred in loginController',
            err
        );

        next(err)
    }
};
