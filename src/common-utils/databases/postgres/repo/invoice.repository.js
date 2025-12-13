import { Op } from 'sequelize';
import Invoice from '../models/invoice.model.js';
import { DatabaseError } from '../../../errorHandler.js';

class InvoiceRepository {
    /**
     * Create a new invoice
     */
    async create(data, transaction = null) {
        try {
            return await Invoice.create(data, { transaction });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    /**
     * Update an existing invoice
     */
    async update(id, data, transaction = null) {
        try {
            const invoice = await Invoice.findByPk(id);
            if (!invoice) return null;

            return await invoice.update(data, { transaction });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    /**
     * Find a single invoice by conditions
     */
    async findOne(where = {}, attributes = null, include = null) {
        try {
            return await Invoice.findOne({
                where,
                attributes,
                include,
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    /**
     * Find an invoice by primary key
     */
    async findById(id, attributes = null, include = null) {
        try {
            return await Invoice.findByPk(id, {
                attributes,
                include,
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    buildWhereClause(filters = {}) {
        const where = {};

        if (filters.customer_id) {
            where.customer_id = filters.customer_id;
        }

        if (filters.status) {
            where.status = filters.status;
        }

        // ✅ Date handling lives ONLY here
        if (filters.from_date || filters.to_date) {
            where.created_at = {};

            if (filters.from_date) {
                where.created_at[Op.gte] = new Date(filters.from_date);
            }

            if (filters.to_date) {
                const end = new Date(filters.to_date);
                end.setHours(23, 59, 59, 999);
                where.created_at[Op.lte] = end;
            }
        }

        return where;
    };

    /**
     * Find multiple invoices
     */
    async findAll(options = {}) {
        const {
            filters = {},
            limit = 10,
            offset = 0,
            order = [['created_at', 'DESC']],
            attributes = null,
            include = null,
        } = options;

        try {
            const where = this.buildWhereClause(filters);

            return await Invoice.findAll({
                where,
                limit,
                offset,
                order,
                attributes,
                include,
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    };


    /**
     * Delete an invoice
     */
    async delete(id, transaction = null) {
        try {
            const invoice = await Invoice.findByPk(id);
            if (!invoice) return null;

            return await invoice.destroy({ transaction });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    /**
     * Find invoice by invoice number
     */
    async findByInvoiceNo(invoiceNo) {
        try {
            return await Invoice.findOne({
                where: { invoice_no: invoiceNo },
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    /**
     * Find invoices by customer
     */
    async findByCustomerId(customerId, options = {}) {
        const {
            limit = 10,
            offset = 0,
            order = [['created_at', 'DESC']],
            status = null,
        } = options;

        try {
            return await Invoice.findAll({
                where: {
                    customer_id: customerId,
                    ...(status && { status }),
                },
                limit,
                offset,
                order,
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    /**
     * Search invoices (invoice_no, status, amount range)
     */
    async search(filters = {}) {
        const {
            invoice_no,
            status,
            min_amount,
            max_amount,
        } = filters;

        try {
            const where = {
                ...(invoice_no && {
                    invoice_no: { [Op.iLike]: `%${invoice_no}%` },
                }),
                ...(status && { status }),
                ...(min_amount || max_amount
                    ? {
                        total_amount: {
                            ...(min_amount && { [Op.gte]: min_amount }),
                            ...(max_amount && { [Op.lte]: max_amount }),
                        },
                    }
                    : {}),
            };

            return await Invoice.findAll({
                where,
                order: [['created_at', 'DESC']],
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    /**
     * Bulk update invoice status based on filters
     * @param {Object} params
     * @param {Object} params.filters - e.g. { status: 'PENDING', created_at_lt: Date }
     * @param {string} params.status - new status to set
     * @returns {Array} updated invoices
     */
    async bulkUpdateStatus({ filters = {}, status }) {
        const where = {};

        if (filters.status) {
            where.status = filters.status;
        }

        if (filters.created_at_lt) {
            where.created_at = { [Op.lt]: filters.created_at_lt };
        }

        // Perform update and return affected rows
        const [updatedCount, updatedRows] = await Invoice.update(
            { status },
            {
                where,
                returning: true, // returns updated rows in Postgres
            }
        );

        return updatedRows; // array of updated invoice instances
    }

}

export default new InvoiceRepository();
