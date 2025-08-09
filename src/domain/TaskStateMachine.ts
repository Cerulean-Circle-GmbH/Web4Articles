// TaskStateMachine.ts (migrated from UpDown/temp)
// OOP implementation for task state management in Web4Articles

import fs from 'fs';
import path from 'path';

export type TaskStatus = 'planned' | 'in-progress' | 'qa-review' | 'done' | 'blocked';
export type StepStatus = 'open' | 'in-progress' | 'done';

export interface TaskStep {
  name: string;
  status: StepStatus;
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  steps: TaskStep[];
  files: {
    taskMd: string;
    dailyJson: string;
    dailyMd: string;
    planningMd: string;
  };
}

export interface DailyJson {
  currentSprint: string;
  currentTask: string;
  status: TaskStatus;
  files: {
    taskMd: string;
    dailyMd: string;
    planningMd: string;
  };
  history: Array<{ timestamp: string; status: TaskStatus; step?: string }>;
}

export class TaskStateMachine {
  // Static utility to load steps and status from a markdown task file
  static parseTaskFile(taskMdPath: string): Task {
    const md = fs.readFileSync(taskMdPath, 'utf-8');

    // Title
    const titleMatch = md.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : 'Untitled Task';

    // Helper to capture section content between this heading and the next heading
    const captureSection = (heading: string): string | null => {
      const headerRe = new RegExp(`^##\\s+${heading}\\b.*$`, 'mi');
      const m = headerRe.exec(md);
      if (!m) return null;
      const start = m.index + m[0].length;
      const rest = md.slice(start);
      const nextHeading = /^\s*##\s+.+$/m.exec(rest);
      const end = nextHeading ? nextHeading.index : rest.length;
      return rest.slice(0, end);
    };

    // Status parsing: look for checkboxes in the Status section, fallback to planned
    const statusSection = captureSection('Status') ?? '';
    const statusLineRegex = /^\s*-\s*\[(x|X|\s)\]\s*(.+)$/gm;
    let status: TaskStatus = 'planned';
    let match: RegExpExecArray | null;
    while ((match = statusLineRegex.exec(statusSection)) !== null) {
      const checked = /x/i.test(match[1] ?? '');
      const label = (match[2] ?? '').toLowerCase();
      if (!checked) continue;
      if (label.includes('done')) status = 'done';
      else if (label.includes('qa')) status = 'qa-review';
      else if (label.includes('progress')) status = 'in-progress';
      else if (label.includes('block')) status = 'blocked';
      else if (label.includes('plan')) status = 'planned';
    }

    // Steps parsing: read list items in the Steps section; support checkbox if present
    const stepsSection = captureSection('Steps') ?? '';
    const steps: TaskStep[] = [];
    if (stepsSection.trim().length > 0) {
      const lines = stepsSection.split(/\r?\n/);
      for (const line of lines) {
        const checkbox = line.match(/^\s*-\s*\[(x|X|\s)\]\s*(.+)$/);
        if (checkbox) {
          const isDone = /x/i.test(checkbox[1]);
          const stepName = checkbox[2].trim();
          steps.push({ name: stepName, status: isDone ? 'done' : 'open' });
          continue;
        }
        const bullet = line.match(/^\s*-\s+(.+)$/);
        if (bullet) {
          const stepName = bullet[1].trim();
          if (stepName.length > 0) {
            steps.push({ name: stepName, status: 'open' });
          }
        }
      }
    }

    return {
      id: path.basename(taskMdPath, '.md'),
      title,
      status,
      steps,
      files: {
        taskMd: taskMdPath,
        dailyJson: '',
        dailyMd: '',
        planningMd: '',
      },
    };
  }
  // ...other methods as needed...
}
