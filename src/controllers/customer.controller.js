import commonUtils from '../common-utils/index.js';
import * as customerService from '../services/customer-services/customer.service.js';

const { RequestResponseHandler: rrHandler } = commonUtils;

/**
 * Create Customer Controller
 * POST /v0/customers
 */
export const createCustomerController = async (req, res, next) => {
    const data = req.requestDetails.requestBody;
    try {
        const createdCustomer = await customerService.createCustomer(data);
        return rrHandler.sendSuccessResponse(res, createdCustomer);
    } catch (err) {
        next(err);
    }
};

/**
 * Fetch All Customers Controller
 * GET /v0/customers
 */
export const fetchCustomersController = async (req, res, next) => {
    const data = req.requestDetails.requestBody;
    try {
        const customers = await customerService.fetchCustomers(data);
        return rrHandler.sendSuccessResponse(res, customers);
    } catch (err) {
        next(err);
    }
};

/**
 * Fetch Single Customer Controller
 * GET /v0/customers/:id
 */
export const fetchSingleCustomerController = async (req, res, next) => {
    const data = req.requestDetails.requestBody;
    try {
        const customer = await customerService.fetchSingleCustomer(data);
        return rrHandler.sendSuccessResponse(res, customer);
    } catch (err) {
        next(err);
    }
};
