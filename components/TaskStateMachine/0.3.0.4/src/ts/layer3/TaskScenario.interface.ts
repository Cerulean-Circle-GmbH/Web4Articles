/**
 * TaskScenario.interface.ts - Web4 Compliant Task Scenario Definition
 * Follows Web4 Scenario-First Development and IOR Architecture
 */

import { IOR } from '../../../../IOR/0.3.0.3/src/ts/layer3/IOR.interface.js';
import { TaskModel, TaskStatus, TaskStep } from './TaskStateMachine.interface.js';

export interface TaskScenario {
  ior: IOR;
  owner: string;  // Encrypted owner information
  model: TaskModel;
  namedLinks?: Array<{
    location: string;  // Relative path for symlink
    filename: string;  // Named link filename
  }>;
  metadata?: {
    created: string;
    updated: string;
    version: string;
  };
}