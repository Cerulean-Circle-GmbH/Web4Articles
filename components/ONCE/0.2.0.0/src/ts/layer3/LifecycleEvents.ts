/**
 * Lifecycle Events v0.2.0.0 - Event-driven component lifecycle management
 * Enhanced from 0.1.0.2 with server hierarchy events
 */

import { Component } from './Component.js';
import { Scenario } from './Scenario.js';

/**
 * Lifecycle event types - enhanced for server hierarchy
 */
export enum LifecycleEventType {
    // Component lifecycle
    BEFORE_INIT = 'before-init',
    AFTER_INIT = 'after-init',
    BEFORE_START = 'before-start',
    AFTER_START = 'after-start',
    BEFORE_PAUSE = 'before-pause',
    AFTER_PAUSE = 'after-pause',
    BEFORE_RESUME = 'before-resume',
    AFTER_RESUME = 'after-resume',
    BEFORE_STOP = 'before-stop',
    AFTER_STOP = 'after-stop',
    BEFORE_SHUTDOWN = 'before-shutdown',
    AFTER_SHUTDOWN = 'after-shutdown',
    
    // Scenario lifecycle
    BEFORE_SAVE = 'before-save',
    AFTER_SAVE = 'after-save',
    BEFORE_LOAD = 'before-load',
    AFTER_LOAD = 'after-load',
    
    // Server hierarchy events (new in v0.2.0.0)
    SERVER_REGISTRATION = 'server-registration',
    SERVER_DISCOVERY = 'server-discovery',
    PORT_CONFLICT = 'port-conflict',
    PRIMARY_SERVER_ELECTION = 'primary-server-election',
    
    // Error events
    ERROR = 'error',
    WARNING = 'warning'
}

/**
 * Lifecycle event data
 */
export interface LifecycleEvent {
    type: LifecycleEventType;
    timestamp: string;
    component?: Component;
    scenario?: Scenario;
    data?: any;
    error?: Error;
}

/**
 * Lifecycle event handler
 */
export type LifecycleEventHandler = (event: LifecycleEvent) => void | Promise<void>;

/**
 * Lifecycle hooks interface - enhanced for server hierarchy
 */
export interface LifecycleHooks {
    beforeInit?: LifecycleEventHandler;
    afterInit?: LifecycleEventHandler;
    beforeStart?: LifecycleEventHandler;
    afterStart?: LifecycleEventHandler;
    beforePause?: LifecycleEventHandler;
    afterPause?: LifecycleEventHandler;
    beforeResume?: LifecycleEventHandler;
    afterResume?: LifecycleEventHandler;
    beforeStop?: LifecycleEventHandler;
    afterStop?: LifecycleEventHandler;
    beforeShutdown?: LifecycleEventHandler;
    afterShutdown?: LifecycleEventHandler;
    beforeSave?: LifecycleEventHandler;
    afterSave?: LifecycleEventHandler;
    beforeLoad?: LifecycleEventHandler;
    afterLoad?: LifecycleEventHandler;
    
    // Server hierarchy hooks (new in v0.2.0.0)
    onServerRegistration?: LifecycleEventHandler;
    onServerDiscovery?: LifecycleEventHandler;
    onPortConflict?: LifecycleEventHandler;
    onPrimaryServerElection?: LifecycleEventHandler;
    
    onError?: LifecycleEventHandler;
    onWarning?: LifecycleEventHandler;
}

/**
 * Lifecycle state enum - enhanced with server states
 */
export enum LifecycleState {
    CREATED = 'created',
    INITIALIZING = 'initializing',
    INITIALIZED = 'initialized',
    STARTING = 'starting',
    RUNNING = 'running',
    PAUSING = 'pausing',
    PAUSED = 'paused',
    RESUMING = 'resuming',
    STOPPING = 'stopping',
    STOPPED = 'stopped',
    SHUTTING_DOWN = 'shutting-down',
    SHUTDOWN = 'shutdown',
    
    // Server hierarchy states (new in v0.2.0.0)
    REGISTERING = 'registering',
    REGISTERED = 'registered',
    PRIMARY_SERVER = 'primary-server',
    CLIENT_SERVER = 'client-server',
    
    ERROR = 'error'
}
