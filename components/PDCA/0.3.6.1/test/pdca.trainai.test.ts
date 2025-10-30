/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { describe, it, expect } from 'vitest';
import { DefaultPDCA } from '../src/ts/layer2/DefaultPDCA.js';

describe('PDCA trainAI Topic Verification (TC27)', () => {
  let pdca: DefaultPDCA;

  beforeEach(() => {
    pdca = new DefaultPDCA();
  });

  // TC27.1: List all topics
  it('TC27.1: trainAI should list all 7 topics when given empty topic', async () => {
    const output = await captureConsoleOutput(() => pdca.trainAI(''));
    
    expect(output).toContain('Available Training Topics');
    expect(output).toContain('start');
    expect(output).toContain('pdca');
    expect(output).toContain('cmm');
    expect(output).toContain('component');
    expect(output).toContain('dual-links');
    expect(output).toContain('ensure-links');
    expect(output).toContain('component-upgrade');
  });

  // TC27.2: how-to-start structure
  it('TC27.2: how-to-start should have required structure', async () => {
    const output = await captureConsoleOutput(() => pdca.trainAI('start'));
    
    expect(output).toContain('How to Start');
    expect(output).toContain('Required Reading');
    expect(output).toContain('Key Lessons');
    expect(output).toContain('Verification Checklist');
    expect(output).toContain('Validates all dual links before session end');
  });

  // TC27.3: how-to-pdca includes dual link awareness
  it('TC27.3: how-to-pdca should include dual link awareness', async () => {
    const output = await captureConsoleOutput(() => pdca.trainAI('pdca'));
    
    expect(output).toContain('How to PDCA');
    expect(output).toContain('Dual link format');
    expect(output).toContain('getDualLink');
    expect(output).toContain('ensureValidLinks');
  });

  // TC27.4: how-to-dual-links content
  it('TC27.4: how-to-dual-links should teach dual link format', async () => {
    const output = await captureConsoleOutput(() => pdca.trainAI('dual-links'));
    
    expect(output).toContain('How to Dual Links');
    expect(output).toContain('GitHub');
    expect(output).toContain('§');
    expect(output).toContain('CMM3 4c');
    expect(output).toContain('getDualLink');
    expect(output).toContain('file://'); // Should mention as violation
  });

  // TC27.5: how-to-ensure-links content
  it('TC27.5: how-to-ensure-links should teach CMM3 atomic operation', async () => {
    const output = await captureConsoleOutput(() => pdca.trainAI('ensure-links'));
    
    expect(output).toContain('How to Ensure Links');
    expect(output).toContain('CMM3 Atomic');
    expect(output).toContain('ensureValidLinks');
    expect(output).toContain('zero knowledge');
    expect(output).toContain('Idempotent');
    expect(output).toContain('findPDCAsLinking');
    expect(output).toContain('updateLinksToFile');
  });

  // TC27.6: how-to-component-upgrade content
  it('TC27.6: how-to-component-upgrade should teach link management', async () => {
    const output = await captureConsoleOutput(() => pdca.trainAI('component-upgrade'));
    
    expect(output).toContain('How to Component Upgrade');
    expect(output).toContain('updateLinksToFile');
    expect(output).toContain('findPDCAsLinking');
    expect(output).toContain('dry-run');
    expect(output).toContain('Version bump');
  });

  // TC27.7: Verify required reading files exist
  it('TC27.7: All required reading files should exist', async () => {
    const { existsSync } = await import('fs');
    const { join } = await import('path');
    const { execSync } = await import('child_process');
    
    const projectRoot = execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' }).trim();
    
    const requiredFiles = [
      'README.md',
      'scrum.pmo/project.journal/2025-09-22-UTC-1908-session/howto.cmm.md',
      'scrum.pmo/roles/_shared/PDCA/template.md',
      'scrum.pmo/roles/_shared/PDCA/howto.PDCA.md',
      'scrum.pmo/roles/_shared/PDCA/PDCA.howto.decide.md',
      'scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md',
      'scrum.pmo/roles/_shared/PDCA/chat.report.template.md',
      'components/Web4TSComponent/latest/README.md'
    ];
    
    for (const file of requiredFiles) {
      const fullPath = join(projectRoot, file);
      expect(existsSync(fullPath), `Required reading file missing: ${file}`).toBe(true);
    }
  });

  // TC27.8: Verify all topics have key lessons
  it('TC27.8: All topics should have at least 5 key lessons', async () => {
    const topics = [
      'start',
      'pdca',
      'cmm',
      'component',
      'dual-links',
      'ensure-links',
      'component-upgrade'
    ];
    
    for (const topic of topics) {
      const output = await captureConsoleOutput(() => pdca.trainAI(topic));
      
      // Count numbered lessons (format: "1. ", "2. ", etc.)
      const lessonMatches = output.match(/^\d+\. /gm);
      const lessonCount = lessonMatches ? lessonMatches.length : 0;
      
      expect(lessonCount, `${topic} should have at least 5 lessons`).toBeGreaterThanOrEqual(5);
    }
  });

  // TC27.9: Verify all topics have verification checklist
  it('TC27.9: All topics should have verification checklist', async () => {
    const topics = [
      'start',
      'pdca',
      'cmm',
      'component',
      'dual-links',
      'ensure-links',
      'component-upgrade'
    ];
    
    for (const topic of topics) {
      const output = await captureConsoleOutput(() => pdca.trainAI(topic));
      
      expect(output, `${topic} should have verification checklist`).toContain('Verification Checklist');
      
      // Count checklist items (format: "[ ] 1. ")
      const checklistMatches = output.match(/\[ \] \d+\. /gm);
      const checklistCount = checklistMatches ? checklistMatches.length : 0;
      
      expect(checklistCount, `${topic} should have at least 3 checklist items`).toBeGreaterThanOrEqual(3);
    }
  });
});

describe('PDCA trainAI Integration Tests (TC28)', () => {
  let pdca: DefaultPDCA;

  beforeEach(() => {
    pdca = new DefaultPDCA();
  });

  // TC28.1: getDualLink mentioned in how-to-dual-links
  it('TC28.1: getDualLink should be taught in how-to-dual-links', async () => {
    const output = await captureConsoleOutput(() => pdca.trainAI('dual-links'));
    
    expect(output).toContain('getDualLink');
    expect(output).toContain('pdca getDualLink');
  });

  // TC28.2: ensureValidLinks mentioned in how-to-ensure-links
  it('TC28.2: ensureValidLinks should be taught in how-to-ensure-links', async () => {
    const output = await captureConsoleOutput(() => pdca.trainAI('ensure-links'));
    
    expect(output).toContain('ensureValidLinks');
    expect(output).toContain('pdca ensureValidLinks');
  });

  // TC28.3: Dual links mentioned in how-to-pdca
  it('TC28.3: Dual links should be integrated into how-to-pdca', async () => {
    const output = await captureConsoleOutput(() => pdca.trainAI('pdca'));
    
    expect(output).toContain('Dual link');
    expect(output).toContain('getDualLink');
  });

  // TC28.4: Session end validation in how-to-start
  it('TC28.4: Session end validation should be in how-to-start', async () => {
    const output = await captureConsoleOutput(() => pdca.trainAI('start'));
    
    expect(output).toContain('session end');
    expect(output).toContain('Validate');
  });

  // TC28.5: Example workflows shown
  it('TC28.5: Training topics should show example command usage', async () => {
    const dualLinksOutput = await captureConsoleOutput(() => pdca.trainAI('dual-links'));
    expect(dualLinksOutput).toContain('pdca getDualLink');
    
    const ensureLinksOutput = await captureConsoleOutput(() => pdca.trainAI('ensure-links'));
    expect(ensureLinksOutput).toContain('pdca ensureValidLinks');
    
    const upgradeOutput = await captureConsoleOutput(() => pdca.trainAI('component-upgrade'));
    expect(upgradeOutput).toContain('pdca updateLinksToFile');
    expect(upgradeOutput).toContain('pdca findPDCAsLinking');
  });

  // TC28.6: Topic dependencies clear
  it('TC28.6: Topic dependencies should be indicated in required reading', async () => {
    const ensureLinksOutput = await captureConsoleOutput(() => pdca.trainAI('ensure-links'));
    
    // how-to-ensure-links should reference the design PDCA
    expect(ensureLinksOutput).toContain('2025-10-20-UTC-1215.pdca.md');
    
    const dualLinksOutput = await captureConsoleOutput(() => pdca.trainAI('dual-links'));
    
    // how-to-dual-links should reference CMM3 compliance checklist
    expect(dualLinksOutput).toContain('cmm3.compliance.checklist.md');
  });
});

// Helper to capture console output
async function captureConsoleOutput(fn: () => Promise<any>): Promise<string> {
  const logs: string[] = [];
  const originalLog = console.log;
  const originalError = console.error;
  
  console.log = (...args: any[]) => {
    logs.push(args.join(' '));
  };
  
  console.error = (...args: any[]) => {
    logs.push(args.join(' '));
  };
  
  try {
    await fn();
    return logs.join('\n');
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
}

