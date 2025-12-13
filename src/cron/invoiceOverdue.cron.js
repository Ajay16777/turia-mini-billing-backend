import commonUtils from '../common-utils/index.js';
const { postgreModels, constants, logger, errorUtils } = commonUtils;
const { invoiceRepo } = postgreModels;

export const invoiceOverdueCron = (cronTime) => {
    return {
        name: 'invoiceOverdueCron',
        schedule: cronTime,
        run: async () => {
            try {
                const updated = await invoiceRepo.bulkUpdateStatus({
                    filters: {
                        status: constants.INVOICE_STATUS.PENDING,
                        created_at_lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    },
                    status: constants.INVOICE_STATUS.OVERDUE,
                });
                logger.info(`[CRON] Marked ${updated.length} invoices as OVERDUE`);
            } catch (err) {
                logger.error('[CRON ERROR] Failed invoiceOverdueCron', new errorUtils.InternalServerError(err));
            }
        },
    };
};
