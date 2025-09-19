/**
 * Lifecycle Events - Event-driven component lifecycle management
 * Web4 pattern: Components emit events at each lifecycle stage
 */

import { Component } from './Component.js';
import { Scenario } from './Scenario.js';

/**
 * Lifecycle event types
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
 * Lifecycle hooks interface
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
    onError?: LifecycleEventHandler;
    onWarning?: LifecycleEventHandler;
}

/**
 * Lifecycle state enum
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
    ERROR = 'error'
}