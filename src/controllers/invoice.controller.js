import commonUtils from '../common-utils/index.js';
const { logger, errorUtils, RequestResponseHandler: rrHandler } = commonUtils;
const { InternalServerError, ValidationError } = errorUtils;


// Create Invoice
export const createInvoiceController = async (req, res) => {
    const body = req.requestDetails.requestBody;
    try {
        // const invoice = await invoiceService.createInvoice(body);
        const invoice = {}
        return rrHandler.sendSuccessResponse(res, invoice, 201);
    } catch (err) {
        return rrHandler.sendErrorResponse(res, err instanceof ValidationError ? err : new InternalServerError(err.message));
    }
};

// Get all invoices (with optional filters)
export const getInvoicesController = async (req, res) => {
    const body = req.requestDetails.requestBody;
    try {
        // const invoices = await invoiceService.getInvoices(body);
        const invoices = [];
        return rrHandler.sendSuccessResponse(res, invoices);
    } catch (err) {
        return rrHandler.sendErrorResponse(res, new InternalServerError(err.message));
    }
};

// Get single invoice
export const getInvoiceController = async (req, res) => {
    const body = req.requestDetails.requestBody;
    try {
        // const invoice = await invoiceService.getInvoice(body);
        const invoice = {};
        return rrHandler.sendSuccessResponse(res, invoice);
    } catch (err) {
        return rrHandler.sendErrorResponse(res, new InternalServerError(err.message));
    }
};

// Update invoice status
export const updateInvoiceStatusController = async (req, res) => {
    const body = req.requestDetails.requestBody;
    try {
        // const updatedInvoice = await invoiceService.updateInvoiceStatus(body);
        const updatedInvoice = {};
        return rrHandler.sendSuccessResponse(res, updatedInvoice);
    } catch (err) {
        return rrHandler.sendErrorResponse(res, new InternalServerError(err.message));
    }
};
