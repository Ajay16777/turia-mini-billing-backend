import Joi from 'joi';
import commonUtils from '../../common-utils/index.js';
import errorMessages from '../errorMessages.js';

const { commonHelper, constants } = commonUtils;
const { validateWithJoi } = commonHelper;
const { PENDING, PAID, CANCELLED, OVERDUE } = constants.INVOICE_STATUS;

/**
 * Schema for creating a new invoice
 */
const createInvoiceSchema = Joi.object({
    customer_id: Joi.string()
        .uuid()
        .required()
        .messages({
            'any.required': errorMessages.INVOICE.CUSTOMER_REQUIRED,
            'string.empty': errorMessages.INVOICE.CUSTOMER_REQUIRED,
            'string.guid': errorMessages.INVOICE.CUSTOMER_INVALID,
        }),
    gst_percentage: Joi.number()
        .min(0)
        .required()
        .messages({
            'any.required': errorMessages.INVOICE.GST_REQUIRED,
            'number.base': errorMessages.INVOICE.GST_INVALID,
            'number.min': errorMessages.INVOICE.GST_INVALID,
        }),
    items: Joi.array()
        .items(
            Joi.object({
                description: Joi.string()
                    .required()
                    .messages({
                        'any.required': errorMessages.INVOICE.ITEM_DESC_REQUIRED,
                        'string.empty': errorMessages.INVOICE.ITEM_DESC_REQUIRED,
                    }),
                amount: Joi.number()
                    .greater(0)
                    .required()
                    .messages({
                        'any.required': errorMessages.INVOICE.ITEM_AMOUNT_REQUIRED,
                        'number.base': errorMessages.INVOICE.ITEM_AMOUNT_INVALID,
                        'number.greater': errorMessages.INVOICE.ITEM_AMOUNT_INVALID,
                    }),
            })
        )
        .min(1)
        .required()
        .messages({
            'array.min': errorMessages.INVOICE.ITEMS_REQUIRED,
            'any.required': errorMessages.INVOICE.ITEMS_REQUIRED,
        }),
});

/**
 * Schema for fetching invoices with filters
 */
const fetchInvoicesSchema = Joi.object({
    customer_id: Joi.string().uuid().optional(),
    status: Joi.string().valid(
        PENDING,
        PAID,
        CANCELLED,
        OVERDUE
    ).optional(),
    from_date: Joi.date().optional(),
    to_date: Joi.date().optional(),
}).optional();

/**
 * Schema for updating invoice status
 */
const updateInvoiceStatusSchema = Joi.object({
    invoice_id: Joi.string()
        .uuid()
        .required()
        .messages({
            'any.required': errorMessages.INVOICE.INVOICE_ID_REQUIRED,
            'string.guid': errorMessages.INVOICE.INVOICE_ID_INVALID,
        }),
    status: Joi.string()
        .valid(PENDING, PAID, CANCELLED, OVERDUE)
        .required()
        .messages({
            'any.required': errorMessages.INVOICE.STATUS_REQUIRED,
            'any.only': errorMessages.INVOICE.STATUS_INVALID,
        }),
});

export const validateCreateInvoice = (payload) => {
    return validateWithJoi(createInvoiceSchema, payload);
};

export const validateFetchInvoices = (payload) => {
    return validateWithJoi(fetchInvoicesSchema, payload);
};

export const validateUpdateInvoiceStatus = (payload) => {
    return validateWithJoi(updateInvoiceStatusSchema, payload);
};
