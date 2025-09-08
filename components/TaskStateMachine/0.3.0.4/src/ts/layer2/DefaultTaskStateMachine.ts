/**
 * DefaultTaskStateMachine - Web4 Compliant Task State Management Implementation
 * Follows Web4 Empty Constructor Principle, IOR Architecture, and Scenario-First Development
 */

import { TaskStateMachine, TaskModel, TaskStatus, TaskStep } from '../layer3/TaskStateMachine.interface.js';
import { TaskScenario } from '../layer3/TaskScenario.interface.js';
import { IOR } from '../../../../IOR/0.3.0.3/src/ts/layer3/IOR.interface.js';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';

export class DefaultTaskStateMachine implements TaskStateMachine {
  private model: TaskModel;

  // Web4 Empty Constructor Principle
  constructor() {
    this.model = {
      uuid: crypto.randomUUID(),
      title: '',
      status: 'planned',
      steps: [],
      planningReference: { uuid: '', component: '', version: '' },
      requirementReferences: [],
      subtaskReferences: []
    };
  }

  // Getters for CLI access (Web4 pattern)
  get taskModel(): TaskModel {
    return this.model;
  }

  // Setters for Web4 configuration pattern
  setTitle(title: string): void {
    this.model.title = title;
  }

  setStatus(status: TaskStatus): void {
    this.model.status = status;
  }

  addStep(step: TaskStep): void {
    this.model.steps.push(step);
  }

  setPlanningReference(planningIOR: IOR): void {
    this.model.planningReference = planningIOR;
  }

  addRequirementReference(requirementIOR: IOR): void {
    this.model.requirementReferences.push(requirementIOR);
  }

  setParentTaskReference(parentIOR: IOR): void {
    this.model.parentTaskReference = parentIOR;
  }

  addSubtaskReference(subtaskIOR: IOR): void {
    this.model.subtaskReferences.push(subtaskIOR);
  }

  // Task state management methods
  startProgress(): boolean {
    if (this.model.status === 'planned') {
      this.model.status = 'in-progress';
      return true;
    }
    return false;
  }

  submitForQA(): boolean {
    if (this.model.status === 'in-progress') {
      this.model.status = 'qa-review';
      return true;
    }
    return false;
  }

  markDone(): boolean {
    if (this.model.status === 'qa-review') {
      this.model.status = 'done';
      return true;
    }
    return false;
  }

  block(reason: string): boolean {
    this.model.status = 'blocked';
    // TODO: Add reason tracking in model
    return true;
  }

  // Scenario-based persistence (Web4 Scenario-First Development)
  toScenario(): TaskScenario {
    return {
      ior: {
        uuid: this.model.uuid,
        component: 'TaskStateMachine',
        version: '0.3.0.4'
      },
      owner: 'encrypted-owner-placeholder', // TODO: Implement proper encryption
      model: this.model,
      metadata: {
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        version: '0.3.0.4'
      }
    };
  }

  fromScenario(scenario: TaskScenario): void {
    this.model = scenario.model;
  }

  // File operations with IOR integration
  parseTaskFile(taskFileIOR: IOR): void {
    // TODO: Implement IOR-based file reading
    // For now, use direct file path (to be replaced with IOR resolution)
    const filePath = `${taskFileIOR.component}/${taskFileIOR.version}/${taskFileIOR.uuid}`;
    
    try {
      const content = readFileSync(filePath, 'utf-8');
      this.parseMarkdownContent(content);
    } catch (error) {
      console.error('Failed to parse task file:', error);
    }
  }

  updateTaskFile(taskFileIOR: IOR): void {
    // TODO: Implement IOR-based file writing
    // For now, use direct file path (to be replaced with IOR resolution)
    const filePath = `${taskFileIOR.component}/${taskFileIOR.version}/${taskFileIOR.uuid}`;
    
    try {
      const content = this.generateMarkdownContent();
      writeFileSync(filePath, content, 'utf-8');
    } catch (error) {
      console.error('Failed to update task file:', error);
    }
  }

  syncWithPlanning(planningIOR: IOR): void {
    // TODO: Implement planning.md synchronization
    // Read planning.md, update task status, write back
    console.log('Planning sync not yet implemented');
  }

  // Private helper methods
  private parseMarkdownContent(content: string): void {
    // Parse title
    const titleMatch = content.match(/^# (.+)$/m);
    if (titleMatch) {
      this.model.title = titleMatch[1].trim();
    }

    // Parse status section
    const statusMatch = content.match(/## Status([\s\S]*?)(?=##|$)/);
    if (statusMatch) {
      const statusSection = statusMatch[1];
      if (statusSection.includes('- [x] Done')) {
        this.model.status = 'done';
      } else if (statusSection.includes('- [x] QA Review')) {
        this.model.status = 'qa-review';
      } else if (statusSection.includes('- [x] In Progress')) {
        this.model.status = 'in-progress';
      } else {
        this.model.status = 'planned';
      }
    }

    // Parse steps section
    const stepsMatch = content.match(/## Steps([\s\S]*?)(?=##|$)/);
    if (stepsMatch) {
      const stepsSection = stepsMatch[1];
      const stepLines = stepsSection.split('\n').filter(line => line.trim().startsWith('-'));
      
      this.model.steps = stepLines.map(line => {
        const isChecked = line.includes('[x]');
        const stepName = line.replace(/^-\s*\[[x\s]\]\s*/, '').trim();
        return {
          name: stepName,
          status: isChecked ? 'done' : 'open'
        };
      });
    }
  }

  private generateMarkdownContent(): string {
    // TODO: Generate markdown content from model
    return `# ${this.model.title}\n\n## Status\n- [${this.model.status === 'planned' ? 'x' : ' '}] Planned\n...`;
  }
}