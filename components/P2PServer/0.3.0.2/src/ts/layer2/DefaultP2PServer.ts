/**
 * DefaultP2PServer - P2P server capability component implementation
 * 
 * Web4 pattern: Empty constructor + scenario initialization
 * Following established radical OOP pattern from IOR and ONCE components
 * Self-managed P2P server capability with type-safe P2PServerModel
 */

import { P2PServer } from '../layer3/P2PServer.interface.js';
import { P2PServerModel } from '../layer3/P2PServerModel.interface.js';
import { IOR, DefaultIOR } from '../../../../IOR/0.3.0.2/src/ts/layer3/IOR.interface.js';
import { Scenario } from '../../../../Scenario/0.3.0.2/src/ts/layer2/DefaultScenario.js';
import { DefaultUser } from '../../../../User/0.3.0.2/src/ts/DefaultUser.js';

export class DefaultP2PServer implements P2PServer {
  private data: P2PServerModel;
  private scenarioService: Scenario;  // ✅ DRY: Shared component composition
  private userService: DefaultUser;   // ✅ DRY: Shared component composition
  private iorComponent: DefaultIOR;   // ✅ DRY: Shared IOR component

  /**
   * Web4 Pattern: Empty constructor
   */
  constructor() {
    // Initialize with minimal P2P server data
    this.data = {
      uuid: '',
      name: 'P2P Server',
      description: 'P2P Server Capability Component',
      port: 42778,
      state: 'stopped',
      peers: [],            // IOR references to peer components
      role: 'peer',         // ✅ Config in model (scenarios ARE configs)
      networkId: '',        // ✅ Config in model (scenarios ARE configs)
      webrtc: true,         // ✅ Config in model (scenarios ARE configs)
      signaling: true,      // ✅ Config in model (scenarios ARE configs)
      encryption: true,     // ✅ Config in model (scenarios ARE configs)
      maxPeers: 50,         // ✅ Config in model (scenarios ARE configs)
      startedAt: undefined,
      stoppedAt: undefined
    };
    
    // ✅ Web4 DRY: Compose with shared components
    this.scenarioService = new Scenario();
    this.userService = new DefaultUser();
    this.iorComponent = new DefaultIOR();
    
    // Radical OOP: Return proxy-wrapped class instance
    return this.createProxy();
  }

  /**
   * Model getter/setter for proxy management (Following IOR pattern)
   */
  get model(): P2PServerModel { 
    return this.data; 
  }
  
  set model(value: P2PServerModel) { 
    this.data = value;
    this.onChange?.(this.data);
  }

  /**
   * Radical OOP: Class-based proxy with encapsulation
   */
  private createProxy(): DefaultP2PServer {
    return new Proxy(this, {
      set: (target, prop, value) => this.handlePropertySet(prop, value),
      get: (target, prop) => this.handlePropertyGet(prop)
    });
  }

  private handlePropertySet(prop: string | symbol, value: any): boolean {
    if (prop in this.data) {
      (this.data as any)[prop] = value;
      this.onChange?.(this.data);
      return true;
    }
    if (prop in this) {
      (this as any)[prop] = value;
      return true;
    }
    return false;
  }

  private handlePropertyGet(prop: string | symbol): any {
    if (prop in this.data) {
      return (this.data as any)[prop];
    }
    return (this as any)[prop];
  }

  /**
   * Initialize from scenario (scenarios ARE configs)
   */
  init(scenario: Scenario): this {
    if (scenario.model) {
      Object.assign(this.data, scenario.model);
    }
    return this;
  }

  /**
   * Optional onChange callback for controller integration
   */
  onChange?: (data: P2PServerModel) => void;

  /**
   * P2PServer Interface Implementation
   */

  async startServer(): Promise<void> {
    this.data.state = 'starting';
    this.data.startedAt = new Date().toISOString();
    
    // P2P server implementation would go here
    console.log(`P2PServer: Starting P2P server on port ${this.data.port}`);
    
    this.data.state = 'running';
  }

  async stopServer(): Promise<void> {
    this.data.state = 'stopping';
    
    // P2P server shutdown would go here
    console.log(`P2PServer: Stopping P2P server on port ${this.data.port}`);
    
    this.data.state = 'stopped';
    this.data.stoppedAt = new Date().toISOString();
  }

  async connectPeer(peerIOR: IOR): Promise<void> {
    // Connect to peer component (Web4 principle: peers are components)
    this.data.peers.push(peerIOR);
    console.log(`P2PServer: Connected to peer ${peerIOR.component}:${peerIOR.uuid}`);
  }

  async disconnectPeer(peerIOR: IOR): Promise<void> {
    // Disconnect from peer component
    this.data.peers = this.data.peers.filter(
      peer => peer.uuid !== peerIOR.uuid
    );
    console.log(`P2PServer: Disconnected from peer ${peerIOR.uuid}`);
  }

  async exchangeScenarios(peerIOR: IOR, scenarios: Scenario[]): Promise<void> {
    // Exchange scenarios with peer
    console.log(`P2PServer: Exchanging ${scenarios.length} scenarios with peer ${peerIOR.uuid}`);
  }

  getPort(): number {
    return this.data.port;
  }

  isRunning(): boolean {
    return this.data.state === 'running';
  }

  async saveAsScenario(): Promise<Scenario> {
    // Delegate hibernation to Scenario component
    const ownerData = await this.userService.generateOwnerData({
      user: 'system',
      hostname: 'localhost',
      uuid: this.data.uuid
    });

    const scenario = new Scenario().init({
      ior: {
        uuid: this.data.uuid,
        component: 'P2PServer',
        version: '0.3.0.0'
      },
      owner: ownerData,
      model: this.data as P2PServerModel
    });

    return scenario;
  }

  /**
   * CLI Command Methods - Same names as CLI commands for delegation
   */

  async start(args: string[]): Promise<void> {
    console.log('P2PServer: Starting peer-to-peer server...');
    this.data.state = 'running';
    console.log(`P2PServer: Server started on port ${this.data.port}`);
  }

  async stop(args: string[]): Promise<void> {
    console.log('P2PServer: Stopping P2P server...');
    this.data.state = 'stopped';
    console.log('P2PServer: Server stopped');
  }

  async status(args: string[]): Promise<void> {
    console.log(`P2PServer Status:`);
    console.log(`  State: ${this.data.state}`);
    console.log(`  Port: ${this.data.port}`);
    console.log(`  Network: ${this.data.network}`);
    console.log(`  Connected Peers: ${this.data.peers.length}`);
    console.log(`  Discovery: ${this.data.discoveryEnabled ? 'enabled' : 'disabled'}`);
  }

  async info(args: string[]): Promise<void> {
    console.log(`P2PServer - Peer-to-Peer Network Capability`);
    console.log(`Version: 0.3.0.0`);
    console.log(`Description: ${this.data.description}`);
    console.log(`UUID: ${this.data.uuid}`);
    console.log(`Network: ${this.data.network}`);
    console.log(`State: ${this.data.state}`);
  }

  async connectPeer(args: string[]): Promise<void> {
    if (args.length === 0) {
      throw new Error('connectPeer requires peer address');
    }
    const peerAddress = args[0];
    console.log(`P2PServer: Connecting to peer at ${peerAddress}...`);
    console.log(`P2PServer: Connected to peer successfully`);
  }

  async listPeers(args: string[]): Promise<void> {
    console.log(`P2PServer Connected Peers (${this.data.peers.length}):`);
    for (const peer of this.data.peers) {
      console.log(`  - Peer: ${peer.component}:${peer.version} (${peer.uuid})`);
    }
  }

  async sendMessage(args: string[]): Promise<void> {
    if (args.length < 2) {
      throw new Error('sendMessage requires peer-id and message');
    }
    const peerId = args[0];
    const message = args.slice(1).join(' ');
    console.log(`P2PServer: Sending message to ${peerId}: "${message}"`);
  }

  /**
   * Utility methods following IOR pattern
   */
  toJSON(): P2PServerModel {
    return { ...this.data };
  }

  validate(): boolean {
    return !!(this.data.uuid && this.data.name && this.data.description);
  }

  static create(uuid: string, name: string, description: string, port: number): DefaultP2PServer {
    const scenario = new Scenario().init({
      ior: { uuid, component: 'P2PServer', version: '0.3.0.0' },
      owner: '',
      model: { uuid, name, description, port } as P2PServerModel
    });
    return new DefaultP2PServer().init(scenario);
  }
}