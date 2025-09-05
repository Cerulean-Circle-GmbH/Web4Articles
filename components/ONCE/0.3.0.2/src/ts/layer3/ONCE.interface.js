/**
 * ONCE Interface - Object Network Communication Engine
 *
 * Web4 principle: Single interface per file
 * ONCE Role: Environment kernel that loads components from IORs
 * NOT a server implementation - that belongs to capability components
 */
export { DefaultServiceRegistry } from '../layer2/DefaultServiceRegistry.js';
export { DefaultONCE } from '../layer2/DefaultONCE.js';
// DRY Compliance: Use unified Scenario component
export { Scenario } from '../../../../Scenario/0.3.0.2/dist/ts/Scenario.js';
