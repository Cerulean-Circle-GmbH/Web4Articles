# Logger & Verification Principles (Canonical)

- All CLI, backend, and test code must use the canonical Logger.
- Logging must be environment-aware, non-intrusive in production, and support traceability for debugging and process improvement.
- After any automated or scripted action, always verify the intended effect (e.g., file creation, output, or state change) and document any discrepancies for process improvement.
