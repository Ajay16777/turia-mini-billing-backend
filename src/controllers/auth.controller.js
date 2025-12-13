import commonUtils from '../common-utils/index.js';
import * as authService from '../services/auth-services/auth.service.js';

const { RequestResponseHandler: rrHandler } = commonUtils;

/**
 * Login Controller
 * POST /v0/auth/login
 */
export const loginController = async (req, res, next) => {
    const data = req.requestDetails.requestBody;
    try {
        const authResponse = await authService.login(data);
        return rrHandler.sendSuccessResponse(res, authResponse);
    } catch (err) {
        next(err)
    }
};
