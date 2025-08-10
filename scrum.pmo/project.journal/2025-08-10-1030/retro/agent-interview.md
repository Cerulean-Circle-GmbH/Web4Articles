[Back to Retro Instructions](./retro-instructions.md)

# Agent Interview Prompt (Copy into each agent)

Context: This retro runs on branch `retro/2025-08-10-agent-retro`. Please write your answers into a new file in this directory named `answer.[agent-name].md`.

Read first: See `retro-instructions.md` for goals, structure, and DRY policies.

## Questions (ScrumMaster-scope + specialization)

1. Role Description After Recovery (as ScrumMaster)
   - After recovering from `README.md`, how would you, as a ScrumMaster, describe your own role given your specialization? Include a subsection:
     - Settiles Role Description: a detailed role definition tailored to your specialization, covering responsibilities, guardrails, and handoffs.

2. Achievements
   - What did you deliver in this iteration? List artifacts (files, commits), tests that validate them, and any user-facing changes.

3. Recurring Problems
   - What problems recurred? For each, add subsections:
     - Detailed description
     - Examples (file paths, test names, logs)
     - Suspected root cause(s)
     - Proposed fix (process and/or code)

4. QA Feedback Review
   - Which QA comments were helpful and why?
   - Which QA comments were confusing and why?
   - Proposals to improve QA prompts or acceptance criteria.

5. Process Improvements (Actionable)
   - Concrete changes to: recovery flow, commit/push policy, branch strategy, test determinism, release gating.
   - Where should these be documented (role `process.md`, `README.md`, `recovery.md`, test READMEs)?

## Scrum-Master Questions (suggested)
- Where should the “Recover from README” default be refined or extended? Any additional hooks per role?
- Do we need a pre-release “prompt-line behavior” sanity script to block releases earlier?
- How can we ensure plan-vs-implementation sync (e.g., Sprint 2 Task 7 status) automatically?

## QA Questions
- Which QA comments most reduced ambiguity? Quote and explain impact.
- Which QA comments increased ambiguity? Quote and suggest a clearer version.
- What single QA checklist item would have prevented your top recurring problem?

Please keep answers concise but evidence-based, and use relative links. Save as `answer.[agent-name].md`.


