/**
 * TaskStateMachine.interface.ts - Web4 Compliant Task State Management
 * Follows Web4 Empty Constructor Principle and IOR Architecture
 */

import { IOR } from '../../../../IOR/0.3.0.3/src/ts/layer3/IOR.interface.js';
import { Scenario } from './TaskScenario.interface.js';

export type TaskStatus = 'planned' | 'in-progress' | 'qa-review' | 'done' | 'blocked';
export type StepStatus = 'open' | 'in-progress' | 'done';

export interface TaskStep {
  name: string;
  status: StepStatus;
}

export interface TaskModel {
  uuid: string;
  title: string;
  status: TaskStatus;
  steps: TaskStep[];
  planningReference: IOR;  // IOR to planning.md file
  requirementReferences: IOR[];  // IOR array to requirement files
  parentTaskReference?: IOR;  // IOR to parent task (for subtasks)
  subtaskReferences: IOR[];  // IOR array to subtask files
}

export interface TaskStateMachine {
  // Web4 Empty Constructor Principle
  
  // Getters for CLI access
  get taskModel(): TaskModel;
  
  // Setters for Web4 configuration pattern
  setTitle(title: string): void;
  setStatus(status: TaskStatus): void;
  addStep(step: TaskStep): void;
  setPlanningReference(planningIOR: IOR): void;
  addRequirementReference(requirementIOR: IOR): void;
  setParentTaskReference(parentIOR: IOR): void;
  addSubtaskReference(subtaskIOR: IOR): void;
  
  // Task state management methods
  startProgress(): boolean;
  submitForQA(): boolean;
  markDone(): boolean;
  block(reason: string): boolean;
  
  // Scenario-based persistence (Web4 Scenario-First Development)
  toScenario(): Scenario;
  fromScenario(scenario: Scenario): void;
  
  // File operations with IOR integration
  parseTaskFile(taskFileIOR: IOR): void;
  updateTaskFile(taskFileIOR: IOR): void;
  syncWithPlanning(planningIOR: IOR): void;
}