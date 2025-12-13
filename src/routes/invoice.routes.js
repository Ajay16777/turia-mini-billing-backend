import express from 'express';
import commonUtils from '../common-utils/index.js';
const { auth, constants } = commonUtils;
import {
    createInvoiceController,
    getInvoicesController,
    updateInvoiceStatusController
} from '../controllers/invoice.controller.js';

const router = express.Router();
const { authorize, authenticate } = auth;
const { ADMIN, CUSTOMER } = constants.ROLES;

/**
 * Define and configure invoice management routes for the application.
 * @param app - The Express.js application to which routes will be added.
 */
export const invoiceRoutes = (app) => {
    // Mount router under /v0/invoices
    app.use('/v0/invoices', router);

    // Create invoice → only admin
    router.post('/create', authenticate, authorize([ADMIN]), createInvoiceController);

    // Get invoices → admin sees all, customer sees their own
    router.post('/get', authenticate, getInvoicesController);

    // Update invoice status → only admin
    router.post('/update', authenticate, authorize([ADMIN]), updateInvoiceStatusController);
};
