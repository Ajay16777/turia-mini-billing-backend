// ============================================
// tests/runner/testRunner.js
// Enhanced test runner with commonUtils integration
// ============================================
import commonUtils from '../../common-utils/index.js';

const { logger } = commonUtils;

export class TestRunner {
    constructor(app) {
        this.app = app;
        this.context = {};
        this.executedSteps = new Set();
    }

    // Replace placeholders including timestamp
    replacePlaceholders(obj) {
        const jsonStr = JSON.stringify(obj);
        const timestamp = Date.now();

        const replaced = jsonStr
            .replace(/\{\{timestamp\}\}/g, timestamp)
            .replace(/\{\{(\w+)\}\}/g, (match, key) => {
                return this.context[key] !== undefined ? this.context[key] : match;
            });

        return JSON.parse(replaced);
    }

    // Get nested value from object
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }

    // Execute prerequisite steps
    async executePrerequisites(steps, allScenarios) {
        for (const stepKey of steps) {
            if (this.executedSteps.has(stepKey)) {
                continue;
            }

            let scenario = null;
            for (const category in allScenarios) {
                if (allScenarios[category][stepKey]) {
                    scenario = allScenarios[category][stepKey];
                    break;
                }
            }

            if (!scenario) {
                logger.error({}, `Prerequisite step not found: ${stepKey}`, {
                    tags: ['test-runner'],
                });
                throw new Error(`Prerequisite step not found: ${stepKey}`);
            }

            if (scenario.stepsToRunBeforeThisUseCase?.length > 0) {
                await this.executePrerequisites(
                    scenario.stepsToRunBeforeThisUseCase,
                    allScenarios
                );
            }

            await this.executeScenario(scenario, stepKey);
            this.executedSteps.add(stepKey);
        }
    }

    // Execute a single scenario
    async executeScenario(scenario, scenarioKey) {
        const { endpoint, method, headers = {}, reqBody, expected } = scenario;

        logger.info(`Executing scenario: ${scenarioKey}`);

        const processedHeaders = this.replacePlaceholders(headers);
        const processedBody = reqBody ? this.replacePlaceholders(reqBody) : undefined;
        const processedEndpoint = this.replacePlaceholders({ e: endpoint }).e;

        // Import supertest dynamically
        const { default: request } = await import('supertest');
        let req = request(this.app)[method.toLowerCase()](processedEndpoint);

        // Add headers
        Object.entries(processedHeaders).forEach(([key, value]) => {
            req = req.set(key, value);
        });

        // Add body
        if (processedBody) {
            req = req.send(processedBody);
        }

        // Execute request
        const response = await req;

        // Validate response
        this.validateResponse(response, expected, scenarioKey);

        // Save to context
        if (expected.saveToContext) {
            Object.entries(expected.saveToContext).forEach(([contextKey, value]) => {
                let resolvedValue;

                // ✅ Case 1: Literal value (explicit)
                if (typeof value === 'string' && value.startsWith('literal:')) {
                    resolvedValue = value.replace('literal:', '');
                }

                // ✅ Case 2: Path-based value (default behavior)
                else if (typeof value === 'string') {
                    resolvedValue = this.getNestedValue(response, value);
                }

                // ✅ Case 3: Non-string literal (number, boolean, null, object)
                else {
                    resolvedValue = value;
                }

                this.context[contextKey] = resolvedValue;
                logger.info(`Saved to context: ${contextKey} = ${resolvedValue}`);
            });
        }

        logger.info(`✓ Scenario passed: ${scenarioKey}`);
        return response;
    }

    // Validate response
    validateResponse(response, expected, scenarioKey) {
        // Status code
        if (expected.statusCode && response.status !== expected.statusCode) {
            throw new Error(
                `[${scenarioKey}] Expected status ${expected.statusCode}, got ${response.status}`
            );
        }

        // Response type
        if (expected.responseType === 'array' && !Array.isArray(response.body)) {
            throw new Error(
                `[${scenarioKey}] Expected array response, got ${typeof response.body}`
            );
        }

        // Response shape
        if (expected.responseShape) {
            this.validateShape(response.body, expected.responseShape, scenarioKey);
        }

        // Response match
        if (expected.responseMatch) {
            Object.entries(expected.responseMatch).forEach(([key, expectedValue]) => {
                if (response.body[key] !== expectedValue) {
                    throw new Error(
                        `[${scenarioKey}] Expected ${key} to be ${expectedValue}, got ${response.body[key]}`
                    );
                }
            });
        }

        // Custom assertions
        if (expected.assertions) {
            expected.assertions.forEach((assertion) => {
                this.runAssertion(response.body, assertion, scenarioKey);
            });
        }
    }

    validateShape(obj, shape, scenarioKey, path = '') {
        Object.entries(shape).forEach(([key, expectedType]) => {
            const currentPath = path ? `${path}.${key}` : key;

            if (!(key in obj)) {
                throw new Error(
                    `[${scenarioKey}] Missing property: ${currentPath}`
                );
            }

            const value = obj[key];

            // ✅ Case 1: Primitive / Union type check
            if (typeof expectedType === 'string') {
                const actualType = value === null
                    ? 'null'
                    : Array.isArray(value)
                        ? 'array'
                        : typeof value;

                const allowedTypes = expectedType.split('|');

                if (!allowedTypes.includes(actualType)) {
                    throw new Error(
                        `[${scenarioKey}] Property ${currentPath}: expected ${expectedType}, got ${actualType}`
                    );
                }
            }

            // ✅ Case 2: Nested object (recursive)
            else if (typeof expectedType === 'object' && expectedType !== null) {
                if (value === null || typeof value !== 'object' || Array.isArray(value)) {
                    throw new Error(
                        `[${scenarioKey}] Property ${currentPath}: expected object`
                    );
                }

                this.validateShape(
                    value,
                    expectedType,
                    scenarioKey,
                    currentPath
                );
            }
        });
    }


    // Run custom assertions
    runAssertion(data, assertion, scenarioKey) {
        switch (assertion.type) {
            case 'arrayMinLength':
                if (!Array.isArray(data) || data.length < assertion.value) {
                    throw new Error(
                        `[${scenarioKey}] Array length ${data.length} < ${assertion.value}`
                    );
                }
                break;
            default:
                logger.info(`Unknown assertion type: ${assertion.type}`);
        }
    }

    // Run category
    async runCategory(categoryName, scenarios) {
        const results = [];

        if (!scenarios[categoryName])
            return results;

        // Load all scenarios for prerequisites
        const allScenarios = scenarios[categoryName];

        for (const [scenarioKey, scenario] of Object.entries(allScenarios)) {
            try {
                this.executedSteps.clear();


                if (scenario.stepsToRunBeforeThisUseCase?.length > 0) {
                    await this.executePrerequisites(
                        scenario.stepsToRunBeforeThisUseCase,
                        scenarios
                    );
                }

                await this.executeScenario(scenario, scenarioKey);

                results.push({
                    scenarioKey,
                    status: 'PASSED',
                    description: scenario.description,
                });
            } catch (error) {
                results.push({
                    scenarioKey,
                    status: 'FAILED',
                    description: scenario.description,
                    error: error.message,
                });

                logger.error({}, `✗ Scenario failed: ${scenarioKey}`, {
                    err: error,
                    tags: ['test-runner'],
                });
            }
        }

        return results;
    }
}