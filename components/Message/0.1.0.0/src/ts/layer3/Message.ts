/**
 * Layer 3: Message Interface Definition
 * Web4 Message component interface contracts
 */

export interface MessageData {
  content: string;
  type: 'message' | 'acknowledgment';
  timestamp: string;
  sender: string;
  originalScenarioId?: string;
}

export interface MessageScenario {
  uuid: string;
  component: string;
  version: string;
  data: MessageData;
}

export interface AcknowledgmentScenario {
  uuid: string;
  component: string;
  version: string;
  data: {
    acknowledgedScenarioId: string;
    acknowledgedType: string;
    acknowledgedSender: string;
    timestamp: string;
    sender: string;
    status: 'received' | 'processed' | 'error';
  };
}

export interface Message {
  /**
   * Web4 scenario initialization
   */
  init(scenario: MessageScenario): this;
  
  /**
   * Create acknowledgment scenario for received scenario
   */
  createAcknowledgment(originalScenario: any, sender: string): AcknowledgmentScenario;
  
  /**
   * Write new message scenario
   */
  writeMessageScenario(content: string, sender: string, type?: 'message' | 'acknowledgment'): MessageScenario;
  
  /**
   * Get message content
   */
  getContent(): string;
  
  /**
   * Get message type
   */
  getType(): string;
  
  /**
   * Get sender information
   */
  getSender(): string;
  
  /**
   * Serialize component state to scenario
   */
  toScenario(): MessageScenario;
}
