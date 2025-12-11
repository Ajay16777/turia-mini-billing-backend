import express from 'express';

const router = express.Router();


/**
 * Define and configure user management routes for the application.
 * @param app - The Express.js application to which routes will be added.
 */
export const userManagementRoutes = (app: express.Application) => {
	app.use('/v0/user-management', router);
};
