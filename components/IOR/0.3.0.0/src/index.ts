/**
 * Web4 IOR Component - Shared Interoperable Object Reference
 * 
 * Radically simplified yet resilient foundation for all Web4 components
 * Exports unified IOR interface and DefaultIOR implementation
 */

// Layer 3 - Interfaces
export { IOR, ObjectIdentifier } from './ts/layer3/IOR.interface.js';
export { Model } from './ts/layer3/Model.interface.js';

// Layer 2 - Implementations  
export { DefaultIOR } from './ts/layer2/DefaultIOR.js';
export { DefaultModel } from './ts/layer2/DefaultModel.js';