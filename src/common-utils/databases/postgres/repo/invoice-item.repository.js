import InvoiceItem from '../models/invoice-item.model.js';
import { DatabaseError } from '../../../errorHandler.js';

class InvoiceItemRepository {
    /**
     * Create a new invoice item
     */
    async create(data, transaction = null) {
        try {
            return await InvoiceItem.create(data, { transaction });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    /**
     * Bulk create invoice items
     */
    async bulkCreate(items = [], transaction = null) {
        try {
            return await InvoiceItem.bulkCreate(items, {
                transaction,
                validate: true,
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    /**
     * Update an invoice item
     */
    async update(id, data, transaction = null) {
        try {
            const item = await InvoiceItem.findByPk(id);
            if (!item) return null;

            return await item.update(data, { transaction });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    /**
     * Find a single invoice item
     */
    async findOne(where = {}, attributes = null) {
        try {
            return await InvoiceItem.findOne({
                where,
                attributes,
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    /**
     * Find invoice item by ID
     */
    async findById(id, attributes = null) {
        try {
            return await InvoiceItem.findByPk(id, { attributes });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    /**
     * Find all items for an invoice
     */
    async findByInvoiceId(invoiceId, options = {}) {
        const {
            limit = 50,
            offset = 0,
            order = [['created_at', 'ASC']],
        } = options;

        try {
            return await InvoiceItem.findAll({
                where: { invoice_id: invoiceId },
                limit,
                offset,
                order,
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    /**
     * Delete an invoice item
     */
    async delete(id, transaction = null) {
        try {
            const item = await InvoiceItem.findByPk(id);
            if (!item) return null;

            return await item.destroy({ transaction });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    /**
     * Delete all items for an invoice
     */
    async deleteByInvoiceId(invoiceId, transaction = null) {
        try {
            return await InvoiceItem.destroy({
                where: { invoice_id: invoiceId },
                transaction,
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
}

export default new InvoiceItemRepository();
