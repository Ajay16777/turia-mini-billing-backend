import Joi from 'joi';
import errorMessages from '../errorMessages.js';
import commonUtils from '../../common-utils/index.js';

const { validateWithJoi } = commonUtils.commonHelper;

/**
 * Schema for creating a new user (customer)
 */
const createUserSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'any.required': errorMessages.USER.NAME_REQUIRED,
            'string.empty': errorMessages.USER.NAME_REQUIRED,
            'string.min': errorMessages.USER.NAME_TOO_SHORT,
            'string.max': errorMessages.USER.NAME_TOO_LONG,
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'any.required': errorMessages.USER.EMAIL_REQUIRED,
            'string.email': errorMessages.USER.EMAIL_INVALID,
        }),

    phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .optional()
        .allow(null, '')
        .messages({
            'string.pattern.base': errorMessages.USER.PHONE_INVALID,
        }),

    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'any.required': errorMessages.USER.PASSWORD_REQUIRED,
            'string.min': errorMessages.USER.PASSWORD_TOO_SHORT,
        }),
});

/**
 * Schema for fetching users (optional filters)
 */
const fetchUsersSchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).optional(),
}).optional();

export const validateCreateUser = (payload) => {
    return validateWithJoi(createUserSchema, payload);
};

export const validateFetchUsers = (queryParams) => {
    return validateWithJoi(fetchUsersSchema, queryParams);
};
