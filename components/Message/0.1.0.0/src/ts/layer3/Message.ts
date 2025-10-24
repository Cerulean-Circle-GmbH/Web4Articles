/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
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
