/**
 * CLI Main Entry Point for Web4Test
 * Executable entry point for the Tootsie framework CLI
 */

import { main } from './Web4TestCLI';

// Execute CLI main function
main().catch(error => {
  console.error('❌ CLI execution failed:', error);
  process.exit(1);
});
