import Joi from 'joi';
import errorMessages from '../errorMessages.js';
import commonUtils from '../../common-utils/index.js';

const { validateWithJoi } = commonUtils.commonHelper;

const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'any.required': errorMessages.AUTH.EMAIL_REQUIRED,
            'string.email': errorMessages.AUTH.EMAIL_REQUIRED,
        }),

    password: Joi.string()
        .required()
        .messages({
            'any.required': errorMessages.AUTH.PASSWORD_REQUIRED,
        }),
});

export const validateLogin = (payload) => {
    return validateWithJoi(loginSchema, payload);
};
