/**
 * Layer 2: Default Message Implementation
 * Web4-compliant message component with scenario acknowledgment
 */

import { Message, MessageScenario, MessageData, AcknowledgmentScenario } from '../layer3/Message.js';

export class DefaultMessage implements Message {
  private content: string = '';
  private type: 'message' | 'acknowledgment' = 'message';
  private timestamp: string = '';
  private sender: string = '';
  private originalScenarioId?: string;

  /**
   * Empty constructor - Web4 pattern
   */
  constructor() {
    // Web4 principle: Empty constructor, scenario-based initialization
  }

  /**
   * Initialize from scenario (Web4 pattern)
   */
  init(scenario: MessageScenario): this {
    this.content = scenario.data.content;
    this.type = scenario.data.type;
    this.timestamp = scenario.data.timestamp;
    this.sender = scenario.data.sender;
    this.originalScenarioId = scenario.data.originalScenarioId;
    return this;
  }

  /**
   * Create acknowledgment scenario for received scenario
   */
  createAcknowledgment(originalScenario: any, sender: string): AcknowledgmentScenario {
    return {
      uuid: this.generateUUID(),
      component: 'Message',
      version: '0.1.0.0',
      data: {
        acknowledgedScenarioId: originalScenario.uuid || 'unknown',
        acknowledgedType: originalScenario.component || 'unknown',
        acknowledgedSender: originalScenario.data?.sender || 'unknown',
        timestamp: new Date().toISOString(),
        sender: sender,
        status: 'received'
      }
    };
  }

  /**
   * Write new message scenario
   */
  writeMessageScenario(content: string, sender: string, type: 'message' | 'acknowledgment' = 'message'): MessageScenario {
    return {
      uuid: this.generateUUID(),
      component: 'Message',
      version: '0.1.0.0',
      data: {
        content,
        type,
        timestamp: new Date().toISOString(),
        sender,
        originalScenarioId: this.originalScenarioId
      }
    };
  }

  /**
   * Get message content
   */
  getContent(): string {
    return this.content;
  }

  /**
   * Get message type
   */
  getType(): string {
    return this.type;
  }

  /**
   * Get sender information
   */
  getSender(): string {
    return this.sender;
  }

  /**
   * Serialize to scenario (Web4 hibernation pattern)
   */
  toScenario(): MessageScenario {
    return {
      uuid: this.generateUUID(),
      component: 'Message',
      version: '0.1.0.0',
      data: {
        content: this.content,
        type: this.type,
        timestamp: this.timestamp,
        sender: this.sender,
        originalScenarioId: this.originalScenarioId
      }
    };
  }

  /**
   * Simple UUID generation
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
