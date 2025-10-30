/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

/**
 * Knowledge Integration Test Suite
 * 
 * This test file verifies that meta-learnings from the current session
 * are successfully integrated into trainAI and accessible via RAG queries.
 * 
 * Test-First Pattern: These tests are written BEFORE knowledge integration
 * and should FAIL initially. After Step 6 (trainAI update + build), they
 * should PASS, proving knowledge integration completeness.
 * 
 * PDCA: components/PDCA/0.3.6.1/session/2025-10-30-UTC-1048.pdca.md
 */

import { describe, it, expect } from 'vitest';
import { DefaultPDCA } from '../src/ts/layer2/DefaultPDCA.js';
import { execSync } from 'child_process';

describe('TrainAI Knowledge Integration - Session 2025-10-30', () => {
  
  it('RAG query: test artifact cleanup after pdca test', async () => {
    // Query trainAI for test artifact cleanup pattern
    const result = execSync(
      'pdca queryTrainAI "test artifact cleanup after pdca test failure"',
      { encoding: 'utf-8', cwd: process.cwd() }
    );
    
    // Should find the new pattern about checking git status after test runs
    expect(result).toContain('check git status');
    expect(result).toContain('commit test artifacts');
    expect(result).toContain('after pdca test');
  });
  
  it('RAG query: Entry Criteria Definition of Ready terminology', async () => {
    // Query trainAI for Entry Criteria/DoD terminology
    const result = execSync(
      'pdca queryTrainAI "Entry Criteria Definition of Ready DoD"',
      { encoding: 'utf-8', cwd: process.cwd() }
    );
    
    // Should find Entry Criteria and NOT find old "Entry Breadcrumb" term
    expect(result).toContain('Entry Criteria');
    expect(result).toContain('Definition of Ready');
    expect(result).not.toContain('Entry Breadcrumb');
  });
  
  it('RAG query: baseline truth testing without auto-promotion', async () => {
    // Query trainAI for baseline truth establishment pattern
    const result = execSync(
      'pdca queryTrainAI "baseline truth testing without auto-promotion"',
      { encoding: 'utf-8', cwd: process.cwd() }
    );
    
    // Should find Step 0 baseline pattern
    expect(result).toContain('baseline');
    expect(result).toContain('without auto-promotion');
    // May contain "Step 0" or equivalent baseline establishment concept
  });
  
  it('RAG query: absolute version path anti-pattern', async () => {
    // Query trainAI for absolute version path anti-pattern
    const result = execSync(
      'pdca queryTrainAI "absolute version path symlink latest"',
      { encoding: 'utf-8', cwd: process.cwd() }
    );
    
    // Should find guidance to always use symlinks
    expect(result).toContain('symlink');
    expect(result).toContain('latest');
    // May contain warning about absolute paths or version-specific paths
  });
  
  it('RAG query: knowledge integration test pattern', async () => {
    // Query trainAI for knowledge integration test pattern itself
    const result = execSync(
      'pdca queryTrainAI "knowledge integration test pattern RAG"',
      { encoding: 'utf-8', cwd: process.cwd() }
    );
    
    // Should find the meta-pattern about testing knowledge integration
    expect(result).toContain('knowledge integration');
    expect(result).toContain('test');
    // May contain references to Step 0A or RAG query testing
  });
  
});

