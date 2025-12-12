import * as logger from './logger.js';

/**
 * HTTP status codes as a plain object.
 */
const HttpStatusCode = {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500,
    UNAUTHORIZED: 401,
};

/**
 * Base class for custom errors.
 */
class BaseError extends Error {
    constructor(name, httpCode, description, isOperational, error) {
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
    constructor(name, httpCode = HttpStatusCode.INTERNAL_SERVER, description = 'internal server error', error, isOperational = true) {
        super(name, httpCode, description, isOperational, error);
    }
}

/**
 * Validation error
 */
class ValidationError extends APIError {
    constructor(description = 'Validation error') {
        super('ValidationError', HttpStatusCode.BAD_REQUEST, description, true);
    }
}

/**
 * Internal server error
 */
class InternalServerError extends APIError {
    constructor(description = 'Internal server error') {
        super('InternalServerError', HttpStatusCode.INTERNAL_SERVER, description, false);
    }
}

/**
 * Unauthorized error
 */
class UnauthorizedError extends APIError {
    constructor(description = 'Unauthorized') {
        super('UnauthorizedError', HttpStatusCode.UNAUTHORIZED, description, true);
    }
}

/**
 * Database error
 */
class DatabaseError extends APIError {
    constructor(error, description = 'Database error') {
        if (error && error.message) {
            description = error.message;
        }
        super('DatabaseError', HttpStatusCode.INTERNAL_SERVER, description, error, false);
    }
}

/**
 * Firebase error
 */
class FirebaseError extends APIError {
    constructor(error, description = 'Firebase error') {
        if (error && error.errorInfo && error.errorInfo.message) {
            description = error.errorInfo.message;
        }
        super('FirebaseError', HttpStatusCode.INTERNAL_SERVER, description, error, false);
    }
}

/**
 * AWS error
 */
class AWSError extends APIError {
    constructor(error, description = 'AWS error') {
        description = error || description;
        super('AWSError', HttpStatusCode.INTERNAL_SERVER, description, error, false);
    }
}

/**
 * Auth token error
 */
class AuthTokenError extends APIError {
    constructor(error, description = 'AuthTokenError') {
        if (error && error.error) {
            description = error.error;
        }
        super('AuthTokenError', HttpStatusCode.UNAUTHORIZED, description, error, true);
    }
}

/**
 * Error handler class
 */
class ErrorHandler {
    async handleError(err) {
        logger.error({}, 'Error message from the centralized error-handling component', { tags: [], err });
    }

    isTrustedError(error) {
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
