// src/cron/index.js
import { invoiceOverdueCron } from './invoiceOverdue.cron.js';
// import { dailyReportCron } from './dailyReport.cron.js';
// import { emailReminderCron } from './emailReminder.cron.js';
import cron from 'node-cron';
import commonUtils from '../common-utils/index.js';

const { logger } = commonUtils;

const cronJobs = [
    invoiceOverdueCron,
    // dailyReportCron,
    // emailReminderCron,
];

export const startAllCrons = () => {
    cronJobs.forEach((cronFactory) => {
        const cronJob = cronFactory(commonUtils.cronConfig?.[cronFactory.name] || '*/1 * * * *');

        cron.schedule(cronJob.schedule, cronJob.run);

        logger.info(`[CRON MANAGER] Started cron: ${cronJob.name} (${cronJob.schedule})`);
    });
};
