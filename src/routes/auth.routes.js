import express from 'express';
import { loginController } from '../controllers/auth.controller.js';

const router = express.Router();

/**
 * Define and configure authentication routes for the application.
 * @param app - The Express.js application to which routes will be added.
 */
export const authRoutes = (app) => {
    // Mount base route
    app.use('/v0/auth', router);

    /**
     * Login
     * POST /v0/auth/login
     */
    router.post('/login', loginController);
};
