import commonUtils from '../../common-utils/index.js';
import errorMessages from '../errorMessages.js';
import {
    validateCreateInvoice,
    validateFetchInvoices,
    validateUpdateInvoiceStatus,
} from './invoice.validation.js';

const { errorUtils, postgreModels, constants, PostgreSQLConnection } = commonUtils;
const { ValidationError } = errorUtils;
const { invoiceRepo, invoiceItemRepo } = postgreModels;
const { sequelize } = PostgreSQLConnection;

/**
 * Generate next invoice number
 * Example: INV-0001
 */
const generateInvoiceNo = async () => {
    const lastInvoice = await invoiceRepo.findAll({
        order: [['created_at', 'DESC']],
        limit: 1,
        attributes: ['invoice_no'],
    });

    if (!lastInvoice || lastInvoice.length === 0) return 'INV-0001';

    const lastNo = lastInvoice[0].invoice_no.replace('INV-', '');
    const nextNo = String(Number(lastNo) + 1).padStart(4, '0');
    return `INV-${nextNo}`;
};

/**
 * Create a new invoice with items
 * @param {Object} payload
 * @returns {Object} created invoice with items
 */
const createInvoice = async (payload) => {
    // Validate payload
    const validatedData = validateCreateInvoice(payload);

    const { customer_id, gst_percentage, items } = validatedData;

    const transaction = await sequelize.transaction();

    try {
        // Calculate totals
        const subtotal = items.reduce((sum, item) => sum + Number(item.amount), 0);
        const gstAmount = subtotal * (Number(gst_percentage) / 100);
        const totalAmount = subtotal + gstAmount;

        // Generate invoice number
        const invoice_no = await generateInvoiceNo();

        // Create invoice
        const invoice = await invoiceRepo.create(
            {
                customer_id,
                invoice_no,
                subtotal,
                gst_percentage,
                gst_amount: gstAmount,
                total_amount: totalAmount,
            },
            transaction
        );

        // Create invoice items
        const itemsData = items.map((item) => ({
            invoice_id: invoice.id,
            description: item.description,
            amount: item.amount,
        }));

        await invoiceItemRepo.bulkCreate(itemsData, transaction);

        await transaction.commit();

        return { ...invoice.toJSON(), items: itemsData };
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};

/**
 * Get invoices with optional filters
 * @param {Object} payload
 * @returns {Array} list of invoices
 */
const getInvoices = async (payload) => {
    // Validate filters
    const validatedData = validateFetchInvoices(payload);

    const { customer_id, status, from_date, to_date, currentUser } = validatedData;
    const filters = { from_date, to_date, status };

    const isAdmin = currentUser.role === constants.ROLES.ADMIN;
    const isCustomer = currentUser.role === constants.ROLES.CUSTOMER;

    // Role-based customer filter
    if (isAdmin) {
        // Admin can filter by customer_id if provided
        if (customer_id) {
            filters.customer_id = customer_id;
        }
    } else if (isCustomer) {
        // Customer can ONLY see their own invoices
        filters.customer_id = currentUser.userId;
    }

    // Common filters
    if (status) {
        filters.status = status;
    }

    // Fetch invoices
    const invoices = await invoiceRepo.findAll({
        filters,
        order: [['created_at', 'DESC']],
    });

    return invoices;
};


/**
 * Update invoice status
 * @param {Object} payload
 * @returns {Object} updated invoice
 */
const updateInvoiceStatus = async (payload) => {
    // payload
    const validatedData = validateUpdateInvoiceStatus(payload);
    const { invoice_id, status } = validatedData;

    // Check invoice exists
    const invoice = await invoiceRepo.findById(invoice_id);
    if (!invoice) {
        throw new ValidationError(errorMessages.INVOICE.NOT_FOUND);
    }

    // Update status
    const updatedInvoice = await invoiceRepo.update(invoice_id, { status });

    return updatedInvoice;
};

export {
    createInvoice,
    getInvoices,
    updateInvoiceStatus,
    generateInvoiceNo,
};
