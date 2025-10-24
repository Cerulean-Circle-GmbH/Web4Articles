// HierarchicalCompletionFilter - DRY Web4 architectural pattern for hierarchical completion filtering
// Provides unified filtering logic for file, describe, and itCase completions

export interface HierarchicalResult {
  display: string[];
  tokens: string[];
}

export class HierarchicalCompletionFilter {
  /**
   * Apply prefix filtering to hierarchical completion results
   * Web4 DRY Pattern: Single filtering logic for all completion types
   * 
   * @param result - Hierarchical display and tokens from completion method
   * @param filterPrefix - User-provided prefix to filter by (e.g., '16a', '8', '3b')
   * @param tokenPattern - Regex pattern to extract tokens from display lines
   * @returns Filtered hierarchical display with context preservation
   */
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

  /**
   * Build contextual display showing only filtered items with their hierarchical context
   * Web4 Pattern: Context preservation for professional UX
   * 
   * @param displayLines - Original hierarchical display lines
   * @param filteredTokens - Tokens that match the filter prefix
   * @param tokenPattern - Regex to extract tokens from display lines
   * @returns Filtered display with preserved hierarchical context
   */
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
        if (tokenPattern.source.includes('[a-z]\\)') && !tokenPattern.source.includes('[0-9]+')) {
          // This is a describe pattern like "a)" - need to find file context
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

  /**
   * Find the file number context for a describe line
   * Web4 Pattern: Context reconstruction from hierarchical display
   */
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

  /**
   * Add hierarchical context (file headers, describe headers) for filtered tokens
   * Web4 Pattern: Intelligent context detection based on token structure
   * 
   * @param displayLines - All display lines to search for context
   * @param token - The matching token (e.g., '8a1', '16b', '5')
   * @param filteredDisplay - Array to add context lines to
   * @param addedContexts - Set to track already added context to avoid duplicates
   */
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

  /**
   * Add a context line if it matches the pattern and hasn't been added yet
   * Web4 Pattern: DRY context addition with duplicate prevention
   */
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