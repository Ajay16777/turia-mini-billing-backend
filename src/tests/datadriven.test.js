// ============================================
// tests/datadriven.test.js
// Main test file
// ============================================

import MyApp from '../app.js';
import { TestRunner } from './runner/testRunner.js';
import testScenarios from './data/testScenarios.json';
import request from 'supertest';

describe('Data-Driven API Tests', () => {
    let testRunner;
    let app;
    const myApp = new MyApp();

    beforeAll(async () => {
        process.env.NODE_ENV = 'test';

        app = await myApp.init({});

        testRunner = new TestRunner(app);
    });

    afterAll(async () => {
        await myApp.close();
    });


    describe('Health Check', () => {
        it('should return OK for health check', async () => {
            const response = await request(app).get('/api/healthchecker');

            expect(response.status).toBe(200);
            expect(response.text).toBe('OK');
        });
    });

    describe('Authentication Tests', () => {
        it('should run all authentication scenarios', async () => {
            const results = await testRunner.runCategory(
                'authentication',
                testScenarios
            );

            const failed = results.filter(r => r.status === 'FAILED');

            if (failed.length > 0) {
                console.error('Failed tests:', failed);
                throw new Error(`${failed.length} test(s) failed`);
            }

            expect(failed.length).toBe(0);
        });
    });

    // describe('Customer Management Tests', () => {
    //     it('should run all customer scenarios', async () => {
    //         const results = await testRunner.runCategory(
    //             'customers',
    //             testScenarios
    //         );

    //         const failed = results.filter(r => r.status === 'FAILED');

    //         if (failed.length > 0) {
    //             console.error('Failed tests:', failed);
    //             throw new Error(`${failed.length} test(s) failed`);
    //         }

    //         expect(failed.length).toBe(0);
    //     });
    // });

    // describe('Invoice Management Tests', () => {
    //     it('should run all invoice scenarios', async () => {
    //         const results = await testRunner.runCategory(
    //             'invoices',
    //             testScenarios
    //         );

    //         const failed = results.filter(r => r.status === 'FAILED');

    //         if (failed.length > 0) {
    //             console.error('Failed tests:', failed);
    //             throw new Error(`${failed.length} test(s) failed`);
    //         }

    //         expect(failed.length).toBe(0);
    //     });
    // });
});
