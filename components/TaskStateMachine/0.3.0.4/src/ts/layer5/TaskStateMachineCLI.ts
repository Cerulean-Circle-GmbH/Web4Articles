#!/usr/bin/env node

/**
 * TaskStateMachineCLI - Web4 Compliant Task Status Automation CLI
 * Provides CMM3 systematic task status management and planning synchronization
 * Simplified following Unit CLI pattern - no IOR in CLI (Occam's Razor)
 */

import { DefaultTaskStateMachine } from '../layer2/DefaultTaskStateMachine.js';
import { TaskScenario } from '../layer3/TaskScenario.interface.js';
import { TaskStatus } from '../layer3/TaskStateMachine.interface.js';
import { readFileSync, writeFileSync } from 'fs';

class TaskStateMachineCLI {
  private taskMachine: DefaultTaskStateMachine | null;

  // Web4 Empty Constructor Principle
  constructor() {
    this.taskMachine = null;
  }

  private getOrCreateTaskMachine(): DefaultTaskStateMachine {
    if (!this.taskMachine) {
      this.taskMachine = new DefaultTaskStateMachine();
    }
    return this.taskMachine;
  }

  // CMM3 Task Status Automation Commands
  
  /**
   * Parse task file and extract status
   * Usage: taskstatemachine parse <task-file-path>
   */
  async parseTask(taskFilePath: string): Promise<void> {
    try {
      const content = readFileSync(taskFilePath, 'utf-8');
      const taskMachine = this.getOrCreateTaskMachine();
      
      // Parse content directly (no IOR - Occam's Razor)
      this.parseMarkdownContent(content, taskMachine);
      
      console.log('✅ Task Parsed Successfully:');
      console.log('  Title:', taskMachine.taskModel.title);
      console.log('  Status:', taskMachine.taskModel.status);
      console.log('  Steps:', taskMachine.taskModel.steps.length);
      console.log('  UUID:', taskMachine.taskModel.uuid);
    } catch (error) {
      console.error('❌ Parse Error:', (error as Error).message);
    }
  }

  /**
   * Update task status
   * Usage: taskstatemachine update <task-file-path> <status>
   */
  static async updateTaskStatus(taskFilePath: string, newStatus: string): Promise<void> {
    const taskMachine = new DefaultTaskStateMachine();
    
    // Direct file path approach (IOR removed - Occam's Razor)
    const taskScenario: TaskScenario = {
      filePath: taskFilePath,
      owner: 'system',
      model: {
        uuid: 'temp-uuid',
        title: 'temp-title',
        status: newStatus as TaskStatus,
        steps: [],
        planningReference: '',
        requirementReferences: [],
        subtaskReferences: []
      }
    };
    
    taskMachine.parseTaskFile(taskScenario);
    
    if (['planned', 'in-progress', 'qa-review', 'done', 'blocked'].includes(newStatus)) {
      taskMachine.setStatus(newStatus as any);
      taskMachine.updateTaskFile(taskScenario);
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

  // Add missing parsing method
  private parseMarkdownContent(content: string, taskMachine: DefaultTaskStateMachine): void {
    // Parse title
    const titleMatch = content.match(/^# (.+)$/m);
    if (titleMatch) {
      taskMachine.setTitle(titleMatch[1].trim());
    }

    // Parse status - simplified without IOR
    const statusMatch = content.match(/## Status([\s\S]*?)(?=##|$)/);
    if (statusMatch) {
      const statusSection = statusMatch[1];
      if (statusSection.includes('- [x] Done')) {
        taskMachine.setStatus('done');
      } else if (statusSection.includes('- [x] QA Review')) {
        taskMachine.setStatus('qa-review');
      } else if (statusSection.includes('- [x] In Progress')) {
        taskMachine.setStatus('in-progress');
      } else {
        taskMachine.setStatus('planned');
      }
    }

    // Parse steps
    const stepsMatch = content.match(/## Steps([\s\S]*?)(?=##|$)/);
    if (stepsMatch) {
      const stepsSection = stepsMatch[1];
      const stepLines = stepsSection.split('\n').filter(line => line.trim().startsWith('-'));
      
      stepLines.forEach(line => {
        const isChecked = line.includes('[x]');
        const stepName = line.replace(/^-\s*\[[x\s]\]\s*/, '').trim();
        if (stepName) {
          taskMachine.addStep({
            name: stepName,
            status: isChecked ? 'done' : 'open'
          });
        }
      });
    }
  }

  async run(args: string[]): Promise<void> {
    if (args.length === 0) {
      this.showUsage();
      return;
    }

    const command = args[0];
    const commandArgs = args.slice(1);

    try {
      switch (command) {
        case 'parse':
          if (commandArgs.length === 0) {
            throw new Error('Task file path required for parse command');
          }
          await this.parseTask(commandArgs[0]);
          break;
          
        case 'help':
          this.showUsage();
          break;
          
        default:
          throw new Error(`Unknown command: ${command}`);
      }
    } catch (error) {
      console.error(`❌ TaskStateMachine CLI Error: ${(error as Error).message}`);
      process.exit(1);
    }
  }

  private showUsage(): void {
    console.log(`
TaskStateMachine CLI - Web4 Compliant Task Status Automation

Usage:
  taskstatemachine parse <task-file-path>     # Parse task file and show status
  taskstatemachine help                       # Show this help

Commands:
  parse      Parse task file and extract status information
  help       Show usage information

Examples:
  taskstatemachine parse scrum.pmo/sprints/sprint-20/task-14-fix-central-storage-location.md
  taskstatemachine parse temp/demo-task-test.md
    `);
  }
}

// CLI entry point - standalone function following Unit pattern
async function main() {
  try {
    const cli = new TaskStateMachineCLI();
    await cli.run(process.argv.slice(2));
  } catch (error) {
    console.error(`❌ TaskStateMachine CLI Fatal Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}