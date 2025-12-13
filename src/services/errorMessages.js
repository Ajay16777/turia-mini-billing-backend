const errorMessages = {
    AUTH: {
        EMAIL_REQUIRED: 'Email is required',
        PASSWORD_REQUIRED: 'Password is required',
        INVALID_CREDENTIALS: 'Invalid email or password',
        UNAUTHORIZED: 'Unauthorized access',
    },

    VALIDATION: {
        INVALID_REQUEST: 'Invalid request payload',
    },

    COMMON: {
        INTERNAL_SERVER_ERROR: 'Something went wrong, please try again later',
    },
    USER: {
        NAME_REQUIRED: 'Name is required',
        NAME_TOO_SHORT: 'Name is too short',
        NAME_TOO_LONG: 'Name is too long',
        EMAIL_REQUIRED: 'Email is required',
        EMAIL_INVALID: 'Email is invalid',
        PHONE_REQUIRED: 'Phone number is required',
        PHONE_INVALID: 'Phone number is invalid',
        PASSWORD_REQUIRED: 'Password is required',
        PASSWORD_TOO_SHORT: 'Password must be at least 6 characters',
        INVALID_ID: 'Invalid user ID',
        NOT_FOUND: 'User not found',
        INVALID_ROLE: 'Invalid role provided',
        ALREADY_EXISTS: 'User with this email or phone already exists',
    },

};

export default errorMessages;
