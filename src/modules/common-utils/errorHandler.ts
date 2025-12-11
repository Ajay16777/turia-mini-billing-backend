import * as logger from './logger';

/**
 * An enumeration representing HTTP status codes.
 * @enum {number}
 */
enum HttpStatusCode {
	OK = 200,
	BAD_REQUEST = 400,
	NOT_FOUND = 404,
	INTERNAL_SERVER = 500,
	UNAUTHORIZED= 401
}

/**
 * Base class for custom errors.
 */
class BaseError extends Error {
	public readonly type: string;
	public readonly httpCode: HttpStatusCode;
	public readonly isOperational: boolean;
	public readonly error: Error;
	/**
	 * Creates a new instance of BaseError.
	 * @param {string} name - The name of the error.
	 * @param {HttpStatusCode} httpCode - The HTTP status code associated with the error.
	 * @param {string} description - A description of the error.
	 * @param {any} error - error object.
	 * @param {boolean} isOperational - Indicates whether the error is operational.
	 */
	constructor(name: string, httpCode: HttpStatusCode, description: string, isOperational: boolean, error: Error) {
	  super(description);
	  Object.setPrototypeOf(this, new.target.prototype);

	  this.type = name;
	  this.httpCode = httpCode;
	  this.error = error;
	  this.isOperational = isOperational;

	  Error.captureStackTrace(this);
	}
}

/**
 * A specialized error class for API-related errors.
 */
class APIError extends BaseError {
	/**
	 * Creates a new instance of APIError.
	 * @param {string} name - The name of the error.
	 * @param {HttpStatusCode} httpCode - The HTTP status code associated with the error. (Optional, default is 500)
	 * @param {string} description - A description of the error. (Optional, default is 'internal server error')
	 * @param {any} error - error object.
	 * @param {boolean} isOperational - Indicates whether the error is operational. (Optional, default is true)
	 */
	constructor(name: string, httpCode = HttpStatusCode.INTERNAL_SERVER, description = 'internal server error', error: any, isOperational = true) {
	  super(name, httpCode, description, isOperational, error);
	}
}

/**
 * A specialized error class for validation errors.
 */
class ValidationError extends APIError {
	/**
	 * Creates a new instance of ValidationError.
	 * @param {string} description - A description of the validation error. (Optional, default is 'Validation error')
	 */
	constructor(description = 'Validation error') {
	  super('ValidationError', HttpStatusCode.BAD_REQUEST, description, true);
	}
}

/**
   * A specialized error class for internal server errors.
   */
class InternalServerError extends APIError {
	/**
	 * Creates a new instance of InternalServerError.
	 * @param {string} description - A description of the internal server error. (Optional, default is 'Internal server error')
	 */
	constructor(description = 'Internal server error') {
	  super('InternalServerError', HttpStatusCode.INTERNAL_SERVER, description, false);
	}
}

/**
* A specialized error class for unauthorized errors.
*/
class UnauthorizedError extends APIError {
	/**
	 * Creates a new instance of UnauthorizedError.
	 * @param {string} description - A description of the unauthorized error. (Optional, default is 'Unauthorized')
	 */
	constructor(description = 'Unauthorized') {
	  super('UnauthorizedError', HttpStatusCode.UNAUTHORIZED, description, true);
	}
}

/**
 * A specialized error class for database errors.
 */
class DatabaseError extends APIError {
	/**
	 * Creates a new instance of DatabaseError.
	 * @param {string} description - A description of the database error. (Optional, default is 'Database error')
	 * @param {any} error - error object.
	 */
	constructor(error: any, description = 'Database error') {
		if (error.message) { // Fix the typo in 'messase' to 'message'
			description = error.message; // Fix the typo in 'messase' to 'message'
		}
		super('DatabaseError', HttpStatusCode.INTERNAL_SERVER, description, error, false);
	}
}

/**
 * A specialized error class for Firebase errors.
 */
class FirebaseError extends APIError {
	/**
	 * Creates a new instance of FirebaseError.
	 * @param {string} description - A description of the Firebase error. (Optional, default is 'Firebase error')
	 * @param {any} error - error object.
	 */
	constructor(error: any, description = 'Firebase error') {
		if (error.errorInfo || error.errorInfo.message) {
			description = error.errorInfo.message;
		}
	  super('FirebaseError', HttpStatusCode.INTERNAL_SERVER, description, error, false);
	}
}

/**
 * A specialized error class for database errors.
 */
class AWSError extends APIError {
	/**
	 * Creates a new instance of DatabaseError.
	 * @param {string} description - A description of the database error. (Optional, default is 'Database error')
	 * @param {any} error - error object.
	 */
	constructor(error: any, description = 'AWS error') {
		description = error || description;
		super('AWSError', HttpStatusCode.INTERNAL_SERVER, description, error, false);
	}
}

/**
* A specialized error class for Auth token unauthorized errors.
*/
class AuthTokenError extends APIError {
	/**
	 * Creates a new instance of UnauthorizedError.
	 * @param {string} description - A description of the unauthorized error. (Optional, default is 'Unauthorized')
	 */
	constructor(error: any, description = 'AuthTokenError') {
		if (error.error) {
			description = error.error;
		}
	  super('AuthTokenError', HttpStatusCode.UNAUTHORIZED, description, error, true);
	}
}


/**
 * A class responsible for handling errors.
 */
class ErrorHandler {
	/**
	 * Handles an error and logs it using a logger.
	 * @param {Error} err - The error to handle.
	 */
	public async handleError(err: Error): Promise<void> {
		logger.error({}, 'Error message from the centralized error-handling component', { tags: [], err });
	}

	/**
	 * Checks if an error is considered a trusted, operational error.
	 * @param {Error} error - The error to check.
	 * @returns {boolean} Returns true if the error is operational, false otherwise.
	 */
	public isTrustedError(error: Error) {
	  if (error instanceof BaseError) {
			return error.isOperational;
	  }
	  return false;
	}
}

export {
	ErrorHandler,
	APIError,
	ValidationError,
	InternalServerError,
	UnauthorizedError,
	DatabaseError,
	FirebaseError,
	AWSError,
	AuthTokenError,
};
