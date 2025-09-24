/**
 * TaskStateMachine.interface.ts - Web4 Compliant Task State Management
 * Follows Web4 Empty Constructor Principle and IOR Architecture
 */

// IOR removed - Occam's Razor simplification for CLI
// import { IOR } from '../../../../IOR/0.3.0.3/src/ts/layer3/IOR.interface.js';
import { TaskScenario } from './TaskScenario.interface.js';

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
  planningReference: string;  // File path to planning.md file (IOR removed - Occam's Razor)
  requirementReferences: string[];  // File paths to requirement files (IOR removed)
  parentTaskReference?: string;  // File path to parent task (for subtasks)
  subtaskReferences: string[];  // File paths to subtask files
}

export interface TaskStateMachine {
  // Web4 Empty Constructor Principle
  
  // Getters for CLI access
  get taskModel(): TaskModel;
  
  // Setters for Web4 configuration pattern
  setTitle(title: string): void;
  setStatus(status: TaskStatus): void;
  addStep(step: TaskStep): void;
  setPlanningReference(planningPath: string): void;
  addRequirementReference(requirementPath: string): void;
  setParentTaskReference(parentPath: string): void;
  addSubtaskReference(subtaskPath: string): void;
  
  // Task state management methods
  startProgress(): boolean;
  submitForQA(): boolean;
  markDone(): boolean;
  block(reason: string): boolean;
  
  // Scenario-based persistence (Web4 Scenario-First Development)
  toScenario(): TaskScenario;
  fromScenario(scenario: TaskScenario): void;
  
  // File operations with direct file paths (IOR removed - Occam's Razor)
  parseTaskFile(taskScenario: TaskScenario): void;
  updateTaskFile(taskScenario: TaskScenario): void;
  syncWithPlanning(planningFilePath: string): void;
}