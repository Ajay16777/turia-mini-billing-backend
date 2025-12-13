import express from 'express';
import commonUtils from '../common-utils/index.js';
const { auth, constants } = commonUtils;
const { authorize, authenticate } = auth;

import {
    createCustomerController,
    fetchCustomersController,
    fetchSingleCustomerController,
} from '../controllers/customer.controller.js';

const router = express.Router();
const { ADMIN, CUSTOMER } = constants.ROLES;

/**
 * Define and configure customer management routes for the application.
 * @param app - The Express.js application to which routes will be added.
 */
export const customerRoutes = (app) => {
    // Mount base route
    app.use('/v0/customers', router);

    /**
     * Create Customer
     * POST /v0/customers
     */
    router.post('/', authenticate, authorize([ADMIN]), createCustomerController);

    /**
     * Fetch All Customers
     * GET /v0/customers
     */
    router.get('/', authenticate, authorize([ADMIN]), fetchCustomersController);

    /**
     * Fetch Single Customer
     * GET /v0/customers/:id
     */
    router.get('/profile', authenticate, fetchSingleCustomerController);
};
