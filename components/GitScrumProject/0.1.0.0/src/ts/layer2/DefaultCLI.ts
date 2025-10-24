/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import type { CLI } from '../layer3/CLI.js';

export class DefaultCLI implements CLI {
  private callback: (args: string[]) => void;

  constructor(callback: (args: string[]) => void) {
    this.callback = callback;
  }

  start(): void {
    const args = process.argv.slice(2);
    (async () => {
      const [className, method, ...params] = args;
      let ClassModule, ClassRef;
      try {
        if (!className) throw new Error('No class specified');
        try {
          ClassModule = await import(`../layer1/${className}.js`);
        } catch (e1) {
          try {
            ClassModule = await import(`../layer2/${className}.js`);
          } catch (e2) {
            throw e2;
          }
        }
        // Try both exact and capitalized class name
        ClassRef = ClassModule[className] || ClassModule[className.charAt(0).toUpperCase() + className.slice(1)];
      } catch (e) {
        // Use callback as fallback
        this.callback(args);
        return;
      }
      if (ClassRef && typeof ClassRef[method] === 'function') {
        const result = ClassRef[method](...params);
        if (result instanceof Promise) {
          await result;
        }
        process.exit(0);
        return;
      } else if (ClassRef && typeof ClassRef['help'] === 'function') {
        ClassRef['help']();
        process.exit(0);
        return;
      } else {
        // Use callback as fallback
        this.callback(args);
      }
    })();
  }
}
