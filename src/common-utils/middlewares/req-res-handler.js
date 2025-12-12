/**
 * This class handles all request data and response data
 */
class RequestResponseHandler {
    /**
     * Create an API context by populating requestDetails with request data.
     * @param {import('express').Request} req - The Express Request object.
     * @param {import('express').Response} res - The Express Response object.
     * @param {import('express').NextFunction} next - The Express NextFunction to pass control to the next middleware.
     */
    createApiContext = (req, res, next) => {
        req.requestDetails = {
            requestBody: req.body || null,
            requestParams: req.params || null,
            requestQueryParams: req.query || null,
            requestIp: req.headers['x-forwarded-for'] || undefined,
            requestDevice: req.get('user-agent') || undefined,
        };
        next();
    };

    /**
     * Send a success response with the provided data and optional status code.
     * @param {import('express').Response} res - The Express Response object.
     * @param {*} data - The data to include in the response.
     * @param {number} [statusCode=200] - The HTTP status code.
     */
    sendSuccessResponse = (res, data, statusCode = 200) => {
        return res.status(statusCode).json({
            success: true,
            data,
        });
    };

    /**
     * Send an error/failure response with the provided message and optional status code.
     * @param {import('express').Response} res - The Express Response object.
     * @param {Error|any} error - The error object or message.
     */
    sendErrorResponse = (res, error) => {
        const statusCode = error.httpCode || 500;
        const message = error.message || 'Something went wrong, please try again later';
        return res.status(statusCode).json({
            success: false,
            error: message,
        });
    };
}

// Export an instance of the handler
export default new RequestResponseHandler();
