import { ValidationError } from './errorHandler.js';
import Joi from 'joi';

const parseNumber = (value, defaultValue) => {
    const num = parseInt(value, 10);
    return Number.isNaN(num) ? defaultValue : num;
};

const parseCSV = (value) =>
    value ? value.split(',').map((v) => v.trim()).filter(Boolean) : [];

/**
 * Checks if an array is non-empty.
 * @param {Array} arr - The array to check.
 * @returns {boolean} True if the array is non-empty.
 */
const isNonEmptyArray = (arr) => {
    return Array.isArray(arr) && arr.length > 0;
};

/**
 * Picks specified keys from an object.
 * @param {Object} obj - The source object.
 * @param {...string} keysToPick - Keys to pick from the object.
 * @returns {Object} New object containing only the picked keys.
 */
const pickKeysFromObj = (obj, ...keysToPick) => {
    return Object.assign(
        {},
        ...keysToPick.map((key) => ({ [key]: obj[key] }))
    );
};

/**
 * Common Joi validation handler
 * - Allows only schema-defined keys
 * - Always allows `currentUser`
 */
const validateWithJoi = (schema, payload = {}) => {
    const finalSchema = schema
        .keys({
            currentUser: Joi.object().optional().allow(null),
        })
        .unknown(false);

    const { error, value } = finalSchema.validate(payload, {
        abortEarly: false,
        stripUnknown: false, // remove unknown fields
    });

    if (error) {
        throw new ValidationError(
            error.details.map((detail) => ({
                field: detail.path.join('.'),
                message: detail.message,
            }))
        );
    }

    return value;
};


export {
    parseNumber,
    parseCSV,
    isNonEmptyArray,
    pickKeysFromObj,
    validateWithJoi
};
