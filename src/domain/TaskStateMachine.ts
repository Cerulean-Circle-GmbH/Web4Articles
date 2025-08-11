/**
 * SPDX-License-Identifier: AGPL-3.0-only + AI-GPL-Addendum
 * Copyright (c) 2025 The Web4Articles Authors
 * Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
 * Backlinks: /LICENSE , /AI-GPL.md
 * Use of `scrum.pmo` roles/process docs with AI is subject to AI-GPL copyleft unless dual-licensed.
 */

// TaskStateMachine.ts (migrated from UpDown/temp)
// OOP implementation for task state management in Web4Articles

import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

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
    const titleMatch = md.match(/^# (.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : 'Untitled Task';
    const statusMatch = md.match(/## Status([\s\S]*?)##/);
    const stepsMatch = md.match(/## Steps([\s\S]*?)(?=##|$)/);
    let status: TaskStatus = 'planned';
    let steps: TaskStep[] = [];
    // ...existing code for parsing...
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
