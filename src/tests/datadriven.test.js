// ============================================
// tests/datadriven.test.js
// Main test file (Safe & data-driven)
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

    const runScenarioCategory = (category) => {
        describe(`${category.charAt(0).toUpperCase() + category.slice(1)} Tests`, () => {
            it(`should run all ${category} scenarios`, async () => {
                const results = await testRunner.runCategory(category, testScenarios);

                const failed = results.filter(r => r.status === 'FAILED');

                if (failed.length > 0) {
                    console.error(`Failed ${category} tests:`, failed);
                }

                expect(failed.length).toBe(0);
            });
        });
    };

    ['authentication', 'customers', 'invoices'].forEach(runScenarioCategory);
});