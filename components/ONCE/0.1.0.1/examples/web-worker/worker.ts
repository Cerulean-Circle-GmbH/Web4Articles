/**
 * ONCE Web Worker Example
 * Demonstrates ONCE running in a Web Worker for parallel processing
 */

// Web Worker context
declare const self: DedicatedWorkerGlobalScope;

import { ONCE } from '../../src/index.js';
import { DefaultIOR, DefaultNetworkLocation } from '../../src/ts/layer2/DefaultIOR.js';
import { createCounterScenario } from '../shared/sample-scenarios.js';

// Worker state
let once: any = null;
let processingQueue: any[] = [];
let isProcessing = false;

// Initialize ONCE in worker
async function initializeWorker() {
    try {
        // Initialize ONCE kernel
        once = await ONCE.init();
        
        const env = once.getEnvironment();
        self.postMessage({
            type: 'initialized',
            environment: {
                platform: env.platform,
                capabilities: env.capabilities,
                version: once.getVersion()
            }
        });

        console.log(`✅ ONCE initialized in ${env.platform}`);
    } catch (error) {
        self.postMessage({
            type: 'error',
            error: `Failed to initialize ONCE: ${error}`
        });
    }
}

// Handle messages from main thread
self.addEventListener('message', async (event) => {
    const { type, data } = event.data;

    switch (type) {
        case 'init':
            await initializeWorker();
            break;

        case 'process-scenario':
            await processScenario(data.scenario);
            break;

        case 'batch-process':
            await batchProcessScenarios(data.scenarios);
            break;

        case 'heavy-computation':
            await performHeavyComputation(data);
            break;

        case 'discover-components':
            await discoverComponents(data.query);
            break;

        case 'get-metrics':
            sendMetrics();
            break;

        default:
            self.postMessage({
                type: 'error',
                error: `Unknown command: ${type}`
            });
    }
});

// Process a single scenario
async function processScenario(scenario: any) {
    try {
        // Simulate scenario processing
        const startTime = Date.now();
        
        // Validate scenario structure
        const validation = validateScenario(scenario);
        if (!validation.valid) {
            throw new Error(`Invalid scenario: ${validation.errors.join(', ')}`);
        }

        // Transform scenario (example: add computed fields)
        const processed = {
            ...scenario,
            processing: {
                timestamp: new Date().toISOString(),
                worker: 'web-worker',
                processingTime: 0
            }
        };

        // Simulate some processing work
        await simulateWork(100);

        processed.processing.processingTime = Date.now() - startTime;

        self.postMessage({
            type: 'scenario-processed',
            scenario: processed,
            metrics: {
                processingTime: processed.processing.processingTime
            }
        });

    } catch (error) {
        self.postMessage({
            type: 'processing-error',
            error: error.message,
            scenario: scenario
        });
    }
}

// Batch process multiple scenarios
async function batchProcessScenarios(scenarios: any[]) {
    self.postMessage({
        type: 'batch-started',
        count: scenarios.length
    });

    const results = [];
    const errors = [];

    for (let i = 0; i < scenarios.length; i++) {
        try {
            const processed = await processScenarioInternal(scenarios[i]);
            results.push(processed);
            
            // Report progress
            self.postMessage({
                type: 'batch-progress',
                current: i + 1,
                total: scenarios.length
            });
        } catch (error) {
            errors.push({
                scenario: scenarios[i],
                error: error.message
            });
        }
    }

    self.postMessage({
        type: 'batch-completed',
        results: results,
        errors: errors,
        stats: {
            total: scenarios.length,
            successful: results.length,
            failed: errors.length
        }
    });
}

// Perform heavy computation example
async function performHeavyComputation(data: any) {
    const { iterations = 1000000 } = data;
    
    self.postMessage({
        type: 'computation-started',
        iterations: iterations
    });

    // Example: Calculate prime numbers
    const primes: number[] = [];
    const startTime = Date.now();

    for (let num = 2; num <= iterations && primes.length < 1000; num++) {
        if (isPrime(num)) {
            primes.push(num);
        }

        // Report progress every 100k iterations
        if (num % 100000 === 0) {
            self.postMessage({
                type: 'computation-progress',
                current: num,
                total: iterations,
                primesFound: primes.length
            });
        }
    }

    const computationTime = Date.now() - startTime;

    // Create scenario with results
    const resultScenario = {
        uuid: generateUUID(),
        objectType: 'ComputationResult',
        version: '0.1.0.0',
        state: {
            IOR: `computation:${generateUUID()}`,
            owner: 'web-worker',
            model: {
                type: 'prime-calculation',
                iterations: iterations,
                primesFound: primes.length,
                computationTime: computationTime,
                firstTenPrimes: primes.slice(0, 10)
            }
        },
        metadata: {
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
            description: `Found ${primes.length} primes in ${computationTime}ms`
        }
    };

    self.postMessage({
        type: 'computation-completed',
        result: resultScenario,
        metrics: {
            computationTime: computationTime,
            primesFound: primes.length
        }
    });
}

// Discover components
async function discoverComponents(query: any) {
    if (!once) {
        self.postMessage({
            type: 'error',
            error: 'ONCE not initialized'
        });
        return;
    }

    try {
        const components = await once.discoverComponents(query);
        self.postMessage({
            type: 'components-discovered',
            components: components.map((ior: any) => ior.toURL())
        });
    } catch (error) {
        self.postMessage({
            type: 'error',
            error: `Discovery failed: ${error}`
        });
    }
}

// Send current metrics
function sendMetrics() {
    if (!once) {
        self.postMessage({
            type: 'error',
            error: 'ONCE not initialized'
        });
        return;
    }

    const metrics = once.getMetrics();
    self.postMessage({
        type: 'metrics',
        metrics: {
            ...metrics,
            queueLength: processingQueue.length,
            isProcessing: isProcessing
        }
    });
}

// Validate scenario structure
function validateScenario(scenario: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!scenario.uuid) errors.push('Missing UUID');
    if (!scenario.objectType) errors.push('Missing objectType');
    if (!scenario.version) errors.push('Missing version');
    if (!scenario.state) errors.push('Missing state');
    if (scenario.state && !scenario.state.IOR) errors.push('Missing IOR in state');
    if (scenario.state && !scenario.state.owner) errors.push('Missing owner in state');
    if (scenario.state && !scenario.state.model) errors.push('Missing model in state');

    return {
        valid: errors.length === 0,
        errors: errors
    };
}

// Internal scenario processing
async function processScenarioInternal(scenario: any): Promise<any> {
    // Validate
    const validation = validateScenario(scenario);
    if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
    }

    // Process based on type
    switch (scenario.objectType) {
        case 'Counter':
            return processCounterScenario(scenario);
        case 'Article':
            return processArticleScenario(scenario);
        default:
            return addProcessingMetadata(scenario);
    }
}

// Process counter scenario
function processCounterScenario(scenario: any): any {
    return {
        ...scenario,
        state: {
            ...scenario.state,
            model: {
                ...scenario.state.model,
                value: scenario.state.model.value + 1,
                lastIncremented: new Date().toISOString()
            }
        },
        metadata: {
            ...scenario.metadata,
            modified: new Date().toISOString(),
            processedBy: 'web-worker'
        }
    };
}

// Process article scenario
function processArticleScenario(scenario: any): any {
    const wordCount = scenario.state.model.content?.split(/\s+/).length || 0;
    const charCount = scenario.state.model.content?.length || 0;

    return {
        ...scenario,
        state: {
            ...scenario.state,
            model: {
                ...scenario.state.model,
                statistics: {
                    wordCount: wordCount,
                    characterCount: charCount,
                    lastAnalyzed: new Date().toISOString()
                }
            }
        },
        metadata: {
            ...scenario.metadata,
            modified: new Date().toISOString(),
            processedBy: 'web-worker'
        }
    };
}

// Add processing metadata
function addProcessingMetadata(scenario: any): any {
    return {
        ...scenario,
        processing: {
            timestamp: new Date().toISOString(),
            worker: 'web-worker',
            platform: 'worker'
        }
    };
}

// Helper functions
function isPrime(num: number): boolean {
    for (let i = 2, sqrt = Math.sqrt(num); i <= sqrt; i++) {
        if (num % i === 0) return false;
    }
    return num > 1;
}

async function simulateWork(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Log to main thread
function log(message: string, level: string = 'info') {
    self.postMessage({
        type: 'log',
        level: level,
        message: message,
        timestamp: new Date().toISOString()
    });
}