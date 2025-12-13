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

    INVOICE: {
        CUSTOMER_REQUIRED: 'Customer ID is required',
        CUSTOMER_INVALID: 'Customer ID is invalid',
        GST_REQUIRED: 'GST percentage is required',
        GST_INVALID: 'GST percentage is invalid',
        ITEMS_REQUIRED: 'At least one invoice item is required',
        ITEM_DESC_REQUIRED: 'Item description is required',
        ITEM_AMOUNT_REQUIRED: 'Item amount is required',
        ITEM_AMOUNT_INVALID: 'Item amount must be greater than 0',
        INVOICE_ID_REQUIRED: 'Invoice ID is required',
        INVOICE_ID_INVALID: 'Invoice ID is invalid',
        STATUS_REQUIRED: 'Invoice status is required',
        STATUS_INVALID: 'Invoice status is invalid',
        NOT_FOUND: 'Invoice not found',
        INVALID_PAYLOAD: 'Invalid invoice payload',
    },
};

export default errorMessages;
