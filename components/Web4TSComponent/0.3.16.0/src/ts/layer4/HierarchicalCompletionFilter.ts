/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

// HierarchicalCompletionFilter - DRY Web4 architectural pattern for hierarchical completion filtering
// Provides unified filtering logic for file, describe, and itCase completions

export interface HierarchicalResult {
  display: string[];
  tokens: string[];
}

export class HierarchicalCompletionFilter {
  
  static applyPrefixFilter(
    result: HierarchicalResult,
    filterPrefix: string | undefined,
    tokenPattern: RegExp
  ): string[] {
    // No filtering - return all results
    if (!filterPrefix) {
      return result.display;
    }

    // Filter tokens that start with the prefix
    const filteredTokens = result.tokens.filter(token => token.startsWith(filterPrefix));
    
    if (filteredTokens.length === 0) {
      // No matches - return empty
      return [];
    }

    // Filter the display lines to show only matching entries with context
    return this.buildContextualDisplay(result.display, filteredTokens, tokenPattern);
  }

  
  private static buildContextualDisplay(
    displayLines: string[],
    filteredTokens: string[],
    tokenPattern: RegExp
  ): string[] {
    const filteredDisplay: string[] = [];
    const addedContexts = new Set<string>();

    // Handle case where displayLines contains a single string with newlines (file completion)
    const allLines = displayLines.length === 1 && displayLines[0].includes('\n') 
      ? displayLines[0].split('\n')
      : displayLines;

    for (let i = 0; i < allLines.length; i++) {
      const line = allLines[i];
      
      // Strip ANSI escape codes for pattern matching
      const cleanLine = line.replace(/\x1B\[[0-9;]*m/g, '');
      
      // Check if this line represents a token that matches our filter
      const tokenMatch = cleanLine.match(tokenPattern);
      if (tokenMatch) {
        // For describe tokens, we need to reconstruct the full token from context
        let fullToken = tokenMatch[1];
        
        // For describe patterns like "a)", we need to find the file number from context
        // Check if pattern matches single letters (describe blocks) without file numbers
        if (!fullToken.match(/^\d/) && fullToken.match(/^[a-z]$/)) {
          // This is a describe letter like "a" - need to find file context
          const fileContext = this.findFileContext(allLines, i);
          if (fileContext) {
            fullToken = `${fileContext}${tokenMatch[1]}`;
          }
        }
        
        if (filteredTokens.includes(fullToken)) {
          // Add hierarchical context based on token structure
          this.addHierarchicalContext(
            allLines, 
            fullToken, 
            filteredDisplay, 
            addedContexts
          );
          
          // Add the matching line
          filteredDisplay.push(line);
        }
      }
    }

    // Always add a trailing newline to trigger OOSH multi-line display mode
    // even for single results - this ensures consistent hierarchical display
    const result = filteredDisplay.join('\n');
    return [result + (result ? '\n' : '')];
  }

  
  private static findFileContext(displayLines: string[], currentIndex: number): string | null {
    // Look backwards for the most recent file header
    for (let i = currentIndex - 1; i >= 0; i--) {
      const line = displayLines[i];
      const cleanLine = line.replace(/\x1B\[[0-9;]*m/g, '');
      const fileMatch = cleanLine.match(/^(\d+):/);
      if (fileMatch) {
        return fileMatch[1];
      }
    }
    return null;
  }

  
  private static addHierarchicalContext(
    displayLines: string[],
    token: string,
    filteredDisplay: string[],
    addedContexts: Set<string>
  ): void {
    // Extract hierarchical components from token
    const fileNum = token.match(/^(\d+)/)?.[1];
    const describeMatch = token.match(/^(\d+[a-z])/)?.[1];

    // For file-only tokens (e.g., "1", "17"), no additional context needed
    if (token === fileNum) {
      return;
    }

    // Add file header if not already added
    if (fileNum) {
      const fileHeaderPattern = new RegExp(`^${fileNum}:\\s`);
      this.addContextLine(displayLines, fileHeaderPattern, filteredDisplay, addedContexts);
    }

    // Add describe header if token has describe component and not already added
    if (describeMatch && describeMatch !== token) {
      const describeHeaderPattern = new RegExp(`^\\s{4}${describeMatch}\\)`);
      this.addContextLine(displayLines, describeHeaderPattern, filteredDisplay, addedContexts);
    }
  }

  
  private static addContextLine(
    displayLines: string[],
    pattern: RegExp,
    filteredDisplay: string[],
    addedContexts: Set<string>
  ): void {
    const contextIndex = displayLines.findIndex(l => {
      const cleanL = l.replace(/\x1B\[[0-9;]*m/g, '');
      return pattern.test(cleanL);
    });
    
    if (contextIndex !== -1) {
      const contextLine = displayLines[contextIndex];
      if (!addedContexts.has(contextLine)) {
        filteredDisplay.push(contextLine);
        addedContexts.add(contextLine);
      }
    }
  }
}