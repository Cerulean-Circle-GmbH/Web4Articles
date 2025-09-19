/**
 * DemoStateManager - Web4 Architecture Layer 2
 * Manages interactive demo state following Web4 principles
 * Replaces global state object with proper class-based state management
 */

export interface DemoClientState {
    type: string;
    connected: boolean;
    ws?: any;
    process?: any;
}

export interface DemoState {
    serverProcess: any | null;
    serverPID: number | null;
    serverURL: string | null;
    clients: Map<string, DemoClientState>;
    running: boolean;
    HOST: string | null;
    PORT: number;
    testMode: boolean;
    keyboardEnabled: boolean;
}

export class DemoStateManager {
    private state: DemoState;

    constructor() {
        this.state = {
            serverProcess: null,
            serverPID: null,
            serverURL: null,
            clients: new Map<string, DemoClientState>(),
            running: false,
            HOST: null,
            PORT: 8080,
            testMode: false,
            keyboardEnabled: true
        };
    }

    static fromScenario(scenario: any): DemoStateManager {
        const manager = new DemoStateManager();
        if (scenario?.state) {
            manager.state = { ...manager.state, ...scenario.state };
        }
        return manager;
    }

    public getState(): Readonly<DemoState> {
        return this.state;
    }

    public updateServerProcess(process: any, pid: number): void {
        this.state.serverProcess = process;
        this.state.serverPID = pid;
        this.state.serverURL = `http://${this.state.HOST}:${this.state.PORT}`;
    }

    public setRunning(running: boolean): void {
        this.state.running = running;
    }

    public setHost(host: string): void {
        this.state.HOST = host;
    }

    public addClient(id: string, clientState: DemoClientState): void {
        this.state.clients.set(id, clientState);
    }

    public removeClient(id: string): void {
        this.state.clients.delete(id);
    }

    public clearClients(): void {
        this.state.clients.clear();
    }

    public getClient(id: string): DemoClientState | undefined {
        return this.state.clients.get(id);
    }

    public getAllClients(): Map<string, DemoClientState> {
        return new Map(this.state.clients);
    }

    public setTestMode(testMode: boolean): void {
        this.state.testMode = testMode;
        if (testMode) {
            this.state.keyboardEnabled = false;
        }
    }

    public setKeyboardEnabled(enabled: boolean): void {
        this.state.keyboardEnabled = enabled;
    }

    public resetServer(): void {
        this.state.serverProcess = null;
        this.state.serverPID = null;
        this.state.serverURL = null;
        this.state.running = false;
    }

    public toScenario(): any {
        return {
            uuid: `demo-state-${Date.now()}`,
            objectType: 'DemoState',
            version: '0.1.0.1',
            state: this.state
        };
    }
}
