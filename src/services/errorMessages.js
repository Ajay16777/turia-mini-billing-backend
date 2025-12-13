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
};

export default errorMessages;
