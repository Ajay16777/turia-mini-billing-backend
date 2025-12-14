// ============================================
// tests/runner/testRunner.js
// Safe Test Runner (no uncaught throws)
// ============================================
import commonUtils from '../../common-utils/index.js';

const { logger } = commonUtils;

class ValidationResult {
    constructor() {
        this.passed = true;
        this.errors = [];
    }

    fail(message) {
        this.passed = false;
        this.errors.push(message);
    }
}

export class TestRunner {
    constructor(app) {
        this.app = app;
        this.context = {};
        this.executedSteps = new Set();
    }

    // --------------------------------------------
    // Placeholder replacement (safe, phone regenerated every time)
    // --------------------------------------------
    replacePlaceholders(obj) {
        try {
            const jsonStr = JSON.stringify(obj);

            if (!this.context.timestamp) {
                this.context.timestamp = Date.now();
            }

            // Generate a new unique 10-digit phone number every time
            const randPhone = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            const tsPhone = Date.now().toString().slice(-6);
            const phone = `9${randPhone}${tsPhone}`;

            // Generate a unique random string for email
            const randEmail = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

            const replaced = jsonStr
                .replace(/\{\{phone\}\}/g, phone)
                .replace(/\{\{email_rand\}\}/g, randEmail)
                .replace(/\{\{(\w+)\}\}/g, (match, key) => {
                    return this.context[key] !== undefined && key !== 'phone'
                        ? this.context[key]
                        : match;
                });

            return JSON.parse(replaced);
        } catch (err) {
            logger.error({ err }, 'Placeholder replacement failed');
            return obj; // fail-safe
        }
    }

    // --------------------------------------------
    // Utils
    // --------------------------------------------
    getNestedValue(obj, path) {
        try {
            return path.split('.').reduce((curr, key) => curr?.[key], obj);
        } catch {
            return undefined;
        }
    }

    // --------------------------------------------
    // Prerequisites
    // --------------------------------------------
    async executePrerequisites(steps, allScenarios) {
        for (const stepKey of steps) {
            if (this.executedSteps.has(stepKey)) continue;

            let scenario = null;
            for (const category in allScenarios) {
                if (allScenarios[category][stepKey]) {
                    scenario = allScenarios[category][stepKey];
                    break;
                }
            }

            if (!scenario) {
                logger.error(`Prerequisite not found: ${stepKey}`);
                return; // do not throw
            }

            if (scenario.stepsToRunBeforeThisUseCase?.length) {
                await this.executePrerequisites(
                    scenario.stepsToRunBeforeThisUseCase,
                    allScenarios
                );
            }

            await this.executeScenario(scenario, stepKey);
            this.executedSteps.add(stepKey);
        }
    }

    // --------------------------------------------
    // Scenario execution
    // --------------------------------------------
    async executeScenario(scenario, scenarioKey) {
        const result = new ValidationResult();

        try {
            const { endpoint, method, headers = {}, reqBody, expected } = scenario;
            logger.info(`Executing scenario: ${scenarioKey}`);

            const processedHeaders = this.replacePlaceholders(headers);
            const processedBody = reqBody
                ? this.replacePlaceholders(reqBody)
                : undefined;
            const processedEndpoint = this.replacePlaceholders({ e: endpoint }).e;

            const { default: request } = await import('supertest');
            let req = request(this.app)[method.toLowerCase()](processedEndpoint);

            Object.entries(processedHeaders).forEach(([k, v]) => {
                req = req.set(k, v);
            });

            if (processedBody) req = req.send(processedBody);

            const response = await req;

            this.validateResponse(response, expected, scenarioKey, result);

            if (result.passed && expected?.saveToContext) {
                this.saveContext(response, expected.saveToContext);
            }
        } catch (err) {
            result.fail(`[${scenarioKey}] Runtime error: ${err.message}`);
        }

        if (!result.passed) {
            logger.error(`✗ Scenario failed: ${scenarioKey}`, {
                errors: result.errors,
            });
        } else {
            logger.info(`✓ Scenario passed: ${scenarioKey}`);
        }

        return result;
    }

    // --------------------------------------------
    // Context save (safe)
    // --------------------------------------------
    saveContext(response, saveMap) {
        Object.entries(saveMap).forEach(([key, value]) => {
            let resolved;

            if (typeof value === 'string' && value.startsWith('literal:')) {
                resolved = value.replace('literal:', '');
            } else if (typeof value === 'string') {
                resolved = this.getNestedValue(response, value);
            } else {
                resolved = value;
            }

            this.context[key] = resolved;
            logger.info(`Saved to context: ${key} = ${resolved}`);
        });
    }

    // --------------------------------------------
    // Validation (NO THROWS)
    // --------------------------------------------
    validateResponse(response, expected, scenarioKey, result) {
        if (!expected) return;

        if (expected.statusCode && response.status !== expected.statusCode) {
            result.fail(
                `[${scenarioKey}] Expected status ${expected.statusCode}, got ${response.status}`
            );
        }

        if (expected.responseType === 'array' && !Array.isArray(response.body)) {
            result.fail(`[${scenarioKey}] Expected array response`);
        }

        if (expected.responseShape) {
            this.validateShape(
                response.body,
                expected.responseShape,
                scenarioKey,
                result
            );
        }

        if (expected.responseMatch) {
            Object.entries(expected.responseMatch).forEach(([path, expectedValue]) => {
                const actualValue = this.getNestedValue(response.body, path);

                // Object / array deep compare
                if (
                    typeof expectedValue === 'object' &&
                    expectedValue !== null
                ) {
                    const actualStr = JSON.stringify(actualValue);
                    const expectedStr = JSON.stringify(expectedValue);

                    if (actualStr !== expectedStr) {
                        result.fail(
                            `[${scenarioKey}] Expected ${path}=${expectedStr}, got ${actualStr}`
                        );
                    }
                }
                // Primitive compare
                else if (actualValue !== expectedValue) {
                    result.fail(
                        `[${scenarioKey}] Expected ${path}=${expectedValue}, got ${actualValue}`
                    );
                }
            });
        }

        if (expected.assertions) {
            expected.assertions.forEach((a) => {
                this.runAssertion(response.body, a, scenarioKey, result);
            });
        }
    }

    validateShape(obj, shape, scenarioKey, result, path = '') {
        if (typeof obj !== 'object' || obj === null) {
            result.fail(`[${scenarioKey}] Response body is not an object`);
            return;
        }

        Object.entries(shape).forEach(([key, expectedType]) => {
            const currentPath = path ? `${path}.${key}` : key;

            if (!(key in obj)) {
                result.fail(`[${scenarioKey}] Missing property: ${currentPath}`);
                return;
            }

            const value = obj[key];

            if (typeof expectedType === 'string') {
                const actualType = value === null
                    ? 'null'
                    : Array.isArray(value)
                        ? 'array'
                        : typeof value;

                const allowed = expectedType.split('|');
                if (!allowed.includes(actualType)) {
                    result.fail(
                        `[${scenarioKey}] ${currentPath}: expected ${expectedType}, got ${actualType}`
                    );
                }
            } else if (typeof expectedType === 'object') {
                if (value === null || typeof value !== 'object') {
                    result.fail(`[${scenarioKey}] ${currentPath}: expected object`);
                } else {
                    this.validateShape(value, expectedType, scenarioKey, result, currentPath);
                }
            }
        });
    }

    runAssertion(data, assertion, scenarioKey, result) {
        switch (assertion.type) {
            case 'arrayMinLength':
                if (!Array.isArray(data) || data.length < assertion.value) {
                    result.fail(
                        `[${scenarioKey}] Array length < ${assertion.value}`
                    );
                }
                break;
            default:
                logger.error({}, `Unknown assertion type: ${assertion.type}`);
        }
    }

    // --------------------------------------------
    // Category runner
    // --------------------------------------------
    async runCategory(categoryName, scenarios) {
        const results = [];
        const category = scenarios[categoryName];
        if (!category) return results;

        for (const [scenarioKey, scenario] of Object.entries(category)) {
            this.executedSteps.clear();

            if (scenario.stepsToRunBeforeThisUseCase?.length) {
                await this.executePrerequisites(
                    scenario.stepsToRunBeforeThisUseCase,
                    scenarios
                );
            }

            const res = await this.executeScenario(scenario, scenarioKey);

            results.push({
                scenarioKey,
                status: res.passed ? 'PASSED' : 'FAILED',
                description: scenario.description,
                errors: res.errors,
            });
        }

        return results;
    }
}
