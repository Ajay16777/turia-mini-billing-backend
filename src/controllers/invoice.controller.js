import commonUtils from '../common-utils/index.js';
const { RequestResponseHandler: rrHandler } = commonUtils;
import * as invoiceService from '../services/invoice-services/invoice-service.js';

/**
 * Create Invoice Controller
 * POST /v0/invoices/create
 * Access: Admin only
 */
const createInvoiceController = async (req, res, next) => {
    const data = req.requestDetails.requestBody;
    try {
        const invoice = await invoiceService.createInvoice(data);
        return rrHandler.sendSuccessResponse(res, invoice);
    } catch (err) {
        next(err);
    }
};

/**
 * Get Invoices Controller
 * POST /v0/invoices/get
 * Access:
 *  - Admin: all invoices
 *  - Customer: own invoices only
 */
const getInvoicesController = async (req, res, next) => {
    const data = req.requestDetails.requestBody;
    try {
        const invoices = await invoiceService.getInvoices(data);
        return rrHandler.sendSuccessResponse(res, invoices);
    } catch (err) {
        next(err);
    }
};

/**
 * Update Invoice Status Controller
 * POST /v0/invoices/update
 * Access: Admin only
 */
const updateInvoiceStatusController = async (req, res, next) => {
    const data = req.requestDetails.requestBody;
    try {
        const updatedInvoice = await invoiceService.updateInvoiceStatus(data);
        return rrHandler.sendSuccessResponse(res, updatedInvoice);
    } catch (err) {
        next(err);
    }
};

export {
    createInvoiceController,
    getInvoicesController,
    updateInvoiceStatusController,
};
