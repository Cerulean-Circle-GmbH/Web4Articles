/**
 * TaskStateMachineCLI - Web4 Compliant Task Status Automation CLI
 * Provides CMM3 systematic task status management and planning synchronization
 */

import { DefaultTaskStateMachine } from '../layer2/DefaultTaskStateMachine.js';
import { IOR } from '../../../../IOR/0.3.0.3/src/ts/layer3/IOR.interface.js';

export class TaskStateMachineCLI {
  
  // Web4 Empty Constructor Principle
  constructor() {
    // Empty constructor - configured via setters
  }

  // CMM3 Task Status Automation Commands
  
  /**
   * Parse task file and extract status
   * Usage: taskstatemachine parse <task-file-path>
   */
  static async parseTask(taskFilePath: string): Promise<void> {
    const taskMachine = new DefaultTaskStateMachine();
    
    // TODO: Convert file path to IOR
    const taskIOR: IOR = {
      uuid: taskFilePath,  // Temporary - should be proper IOR
      component: 'TaskStateMachine',
      version: '0.3.0.4'
    };
    
    taskMachine.parseTaskFile(taskIOR);
    
    console.log('Task Status:', taskMachine.taskModel.status);
    console.log('Task Title:', taskMachine.taskModel.title);
    console.log('Steps:', taskMachine.taskModel.steps.length);
    console.log('Requirements:', taskMachine.taskModel.requirementReferences.length);
  }

  /**
   * Update task status
   * Usage: taskstatemachine update <task-file-path> <status>
   */
  static async updateTaskStatus(taskFilePath: string, newStatus: string): Promise<void> {
    const taskMachine = new DefaultTaskStateMachine();
    
    // TODO: Convert file path to IOR
    const taskIOR: IOR = {
      uuid: taskFilePath,
      component: 'TaskStateMachine',
      version: '0.3.0.4'
    };
    
    taskMachine.parseTaskFile(taskIOR);
    
    if (['planned', 'in-progress', 'qa-review', 'done', 'blocked'].includes(newStatus)) {
      taskMachine.setStatus(newStatus as any);
      taskMachine.updateTaskFile(taskIOR);
      console.log(`Task status updated to: ${newStatus}`);
    } else {
      console.error('Invalid status. Use: planned, in-progress, qa-review, done, blocked');
    }
  }

  /**
   * Synchronize planning.md with task files
   * Usage: taskstatemachine sync <planning-file-path>
   */
  static async syncPlanning(planningFilePath: string): Promise<void> {
    // TODO: Implement planning synchronization
    console.log('Planning synchronization not yet implemented');
  }

  /**
   * Validate task status consistency
   * Usage: taskstatemachine validate <sprint-directory>
   */
  static async validateSprint(sprintDirectory: string): Promise<void> {
    // TODO: Implement sprint validation
    console.log('Sprint validation not yet implemented');
  }

  // CLI entry point
  static async main(): Promise<void> {
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
      case 'parse':
        if (args[1]) {
          await TaskStateMachineCLI.parseTask(args[1]);
        } else {
          console.error('Usage: taskstatemachine parse <task-file-path>');
        }
        break;
        
      case 'update':
        if (args[1] && args[2]) {
          await TaskStateMachineCLI.updateTaskStatus(args[1], args[2]);
        } else {
          console.error('Usage: taskstatemachine update <task-file-path> <status>');
        }
        break;
        
      case 'sync':
        if (args[1]) {
          await TaskStateMachineCLI.syncPlanning(args[1]);
        } else {
          console.error('Usage: taskstatemachine sync <planning-file-path>');
        }
        break;
        
      case 'validate':
        if (args[1]) {
          await TaskStateMachineCLI.validateSprint(args[1]);
        } else {
          console.error('Usage: taskstatemachine validate <sprint-directory>');
        }
        break;
        
      default:
        console.log(`
TaskStateMachine CLI - Web4 Compliant Task Status Automation

Usage:
  taskstatemachine parse <task-file-path>     # Parse task file and show status
  taskstatemachine update <task-file> <status> # Update task status
  taskstatemachine sync <planning-file>       # Sync planning with task files
  taskstatemachine validate <sprint-dir>      # Validate sprint task consistency

Commands:
  parse      Parse task file and extract status information
  update     Update task status (planned, in-progress, qa-review, done, blocked)
  sync       Synchronize planning.md with task file status
  validate   Validate task status consistency across sprint

Examples:
  taskstatemachine parse scrum.pmo/sprints/sprint-20/task-14-fix-central-storage-location.md
  taskstatemachine update task-14-fix-central-storage-location.md in-progress
  taskstatemachine sync scrum.pmo/sprints/sprint-20/planning.md
  taskstatemachine validate scrum.pmo/sprints/sprint-20/
        `);
    }
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  TaskStateMachineCLI.main().catch(console.error);
}