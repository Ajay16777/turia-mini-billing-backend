import { NextFunction, Request, Response } from 'express';

// Define a custom type to extend the Request object
declare global {
    interface ExpressRequestWithDetails extends Request {
      requestDetails: {
        requestBody: any;
        requestParams: any;
        requestQueryParams: any;
        requestIp: string | undefined;
        requestDevice: string | undefined;
      };
    }
}


/**
 * This class handles all request data and response data
 */
class RequestResponseHandler {
	/**
     * Create an API context by populating requestDetails with request data.
     * @param req - The Express Request object.
     * @param res - The Express Response object.
     * @param next - The Express NextFunction to pass control to the next middleware.
     */
	createApiContext = (req: Request | ExpressRequestWithDetails | any, res: Response, next: NextFunction) => {
		req.requestDetails = {
			requestBody: req.body || null,
			requestParams: req.params || null,
			requestQueryParams: req.query || null,
			requestIp: req.headers['x-forwarded-for'] as string | undefined,
			requestDevice: req.get('user-agent') || undefined,
		};
		next();
	};

	/**
     * Send a success response with the provided data and optional status code.
     * @param res - The Express Response object.
     * @param data - The data to include in the response.
     * @param statusCode - The HTTP status code (default: 200).
     */
	sendSuccessResponse = (res: Response, data: unknown, statusCode: number = 200) => {
		return res.status(statusCode).json({
			success: true,
			data,
		});
	};

	/**
     * Send an error/failure response with the provided message and optional status code.
     * @param res - The Express Response object.
     */
	sendErrorResponse = (res: Response, error: Error | any) => {
		const statusCode = error.httpCode || 500;
		const message =  error.message || 'Something went wrong please try again after some time';
		return res.status(statusCode).json({
			success: false,
			error: message,
		});
	};
}

export default new RequestResponseHandler();
