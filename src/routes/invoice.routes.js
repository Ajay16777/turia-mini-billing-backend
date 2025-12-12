import express from 'express';
import commonUtils from '../common-utils/index.js';
const { auth, constants } = commonUtils;
import {
    createInvoiceController,
    getInvoicesController,
    getInvoiceController,
    updateInvoiceStatusController
} from '../controllers/invoice.controller.js';

const router = express.Router();
const { authorize, authenticate } = auth;
const { AMDIN, CUSTOMER } = constants.ROLES;

/**
 * Define and configure invoice management routes for the application.
 * @param app - The Express.js application to which routes will be added.
 */
export const invoiceRoutes = (app) => {
    // Mount router under /v0/invoices
    app.use('/v0/invoices', router);

    // Routes
    router.post('/', authenticate, authorize([AMDIN]), createInvoiceController);
    router.get('/', authenticate, getInvoicesController);
    router.get('/:id', authenticate, getInvoiceController);
    router.patch('/:id/status', authenticate, authorize([AMDIN]), updateInvoiceStatusController);
};
