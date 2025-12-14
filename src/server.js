import MyApp from './app.js';
import commonUtils from './common-utils/index.js';
import { startAllCrons } from './cron/index.js';

const { logger } = commonUtils;

(async () => {
    const appInstance = new MyApp();
    const app = await appInstance.init();

    startAllCrons(); // ❗ only in production

    const port = process.env.PORT || 8000;
    app.listen(port, () => {
        logger.info(`Server running on port ${port}`);
    });
})();

process.on('unhandledRejection', (reason) => {
    logger.error({ err: reason }, 'Unhandled Rejection');
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    logger.error({ err: error }, 'Uncaught Exception');
    process.exit(1);
});
