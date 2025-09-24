/**
 * ComponentLifecycleManager - Manages component lifecycle with event hooks
 * Web4 pattern: Event-driven lifecycle state transitions
 */

import { Component } from '../layer3/Component.js';
import { LifecycleEventType, LifecycleEvent, LifecycleHooks, LifecycleState } from '../layer3/LifecycleEvents.js';
import { EventEmitter } from './EventEmitter.js';

interface ComponentState {
    component: Component;
    state: LifecycleState;
    hooks?: LifecycleHooks;
}

export class ComponentLifecycleManager {
    private components: Map<string, ComponentState> = new Map();
    private eventEmitter: EventEmitter;

    constructor(eventEmitter: EventEmitter) {
        this.eventEmitter = eventEmitter;
    }

    async init(): Promise<void> {
        // Register global lifecycle event handlers if needed
    }

    registerHooks(component: Component, hooks: LifecycleHooks): void {
        const key = this.getComponentKey(component);
        const state = this.components.get(key) || {
            component,
            state: LifecycleState.CREATED,
            hooks: {}
        };
        
        // Merge hooks
        state.hooks = { ...state.hooks, ...hooks };
        this.components.set(key, state);

        // Register individual hook handlers
        if (hooks.beforeInit) this.eventEmitter.on(LifecycleEventType.BEFORE_INIT, hooks.beforeInit);
        if (hooks.afterInit) this.eventEmitter.on(LifecycleEventType.AFTER_INIT, hooks.afterInit);
        if (hooks.beforeStart) this.eventEmitter.on(LifecycleEventType.BEFORE_START, hooks.beforeStart);
        if (hooks.afterStart) this.eventEmitter.on(LifecycleEventType.AFTER_START, hooks.afterStart);
        if (hooks.beforePause) this.eventEmitter.on(LifecycleEventType.BEFORE_PAUSE, hooks.beforePause);
        if (hooks.afterPause) this.eventEmitter.on(LifecycleEventType.AFTER_PAUSE, hooks.afterPause);
        if (hooks.beforeResume) this.eventEmitter.on(LifecycleEventType.BEFORE_RESUME, hooks.beforeResume);
        if (hooks.afterResume) this.eventEmitter.on(LifecycleEventType.AFTER_RESUME, hooks.afterResume);
        if (hooks.beforeStop) this.eventEmitter.on(LifecycleEventType.BEFORE_STOP, hooks.beforeStop);
        if (hooks.afterStop) this.eventEmitter.on(LifecycleEventType.AFTER_STOP, hooks.afterStop);
        if (hooks.beforeShutdown) this.eventEmitter.on(LifecycleEventType.BEFORE_SHUTDOWN, hooks.beforeShutdown);
        if (hooks.afterShutdown) this.eventEmitter.on(LifecycleEventType.AFTER_SHUTDOWN, hooks.afterShutdown);
        if (hooks.onError) this.eventEmitter.on(LifecycleEventType.ERROR, hooks.onError);
    }

    async startComponent(component: Component): Promise<void> {
        const key = this.getComponentKey(component);
        const state = this.getOrCreateState(component);

        if (state.state !== LifecycleState.INITIALIZED && state.state !== LifecycleState.STOPPED) {
            throw new Error(`Cannot start component in state: ${state.state}`);
        }

        // Emit before start event
        await this.emitEvent(LifecycleEventType.BEFORE_START, component);
        
        state.state = LifecycleState.STARTING;
        
        // Component start logic here
        state.state = LifecycleState.RUNNING;
        
        // Emit after start event
        await this.emitEvent(LifecycleEventType.AFTER_START, component);
    }

    async pauseComponent(component: Component): Promise<void> {
        const key = this.getComponentKey(component);
        const state = this.getOrCreateState(component);

        if (state.state !== LifecycleState.RUNNING) {
            throw new Error(`Cannot pause component in state: ${state.state}`);
        }

        // Emit before pause event
        await this.emitEvent(LifecycleEventType.BEFORE_PAUSE, component);
        
        state.state = LifecycleState.PAUSING;
        
        // Component pause logic here
        state.state = LifecycleState.PAUSED;
        
        // Emit after pause event
        await this.emitEvent(LifecycleEventType.AFTER_PAUSE, component);
    }

    async resumeComponent(component: Component): Promise<void> {
        const key = this.getComponentKey(component);
        const state = this.getOrCreateState(component);

        if (state.state !== LifecycleState.PAUSED) {
            throw new Error(`Cannot resume component in state: ${state.state}`);
        }

        // Emit before resume event
        await this.emitEvent(LifecycleEventType.BEFORE_RESUME, component);
        
        state.state = LifecycleState.RESUMING;
        
        // Component resume logic here
        state.state = LifecycleState.RUNNING;
        
        // Emit after resume event
        await this.emitEvent(LifecycleEventType.AFTER_RESUME, component);
    }

    async stopComponent(component: Component): Promise<void> {
        const key = this.getComponentKey(component);
        const state = this.getOrCreateState(component);

        if (state.state === LifecycleState.STOPPED || state.state === LifecycleState.SHUTDOWN) {
            return; // Already stopped
        }

        // Emit before stop event
        await this.emitEvent(LifecycleEventType.BEFORE_STOP, component);
        
        state.state = LifecycleState.STOPPING;
        
        // Component stop logic here
        state.state = LifecycleState.STOPPED;
        
        // Emit after stop event
        await this.emitEvent(LifecycleEventType.AFTER_STOP, component);
    }

    async shutdownComponent(component: Component): Promise<void> {
        const key = this.getComponentKey(component);
        const state = this.getOrCreateState(component);

        // Stop first if running
        if (state.state === LifecycleState.RUNNING || state.state === LifecycleState.PAUSED) {
            await this.stopComponent(component);
        }

        // Emit before shutdown event
        await this.emitEvent(LifecycleEventType.BEFORE_SHUTDOWN, component);
        
        state.state = LifecycleState.SHUTTING_DOWN;
        
        // Component shutdown logic
        await component.shutdown();
        
        state.state = LifecycleState.SHUTDOWN;
        
        // Emit after shutdown event
        await this.emitEvent(LifecycleEventType.AFTER_SHUTDOWN, component);
        
        // Remove from tracking
        this.components.delete(key);
    }

    private async emitEvent(type: LifecycleEventType, component: Component, data?: any): Promise<void> {
        const event: LifecycleEvent = {
            type,
            timestamp: new Date().toISOString(),
            component,
            data
        };
        await this.eventEmitter.emit(type, event);
    }

    private getComponentKey(component: Component): string {
        return `${component.getName()}:${component.getVersion()}`;
    }

    private getOrCreateState(component: Component): ComponentState {
        const key = this.getComponentKey(component);
        let state = this.components.get(key);
        if (!state) {
            state = {
                component,
                state: LifecycleState.CREATED
            };
            this.components.set(key, state);
        }
        return state;
    }

    toScenario(): any {
        const states: any[] = [];
        for (const [key, state] of this.components.entries()) {
            states.push({
                key,
                state: state.state,
                hasHooks: !!state.hooks
            });
        }
        return { componentStates: states };
    }
}