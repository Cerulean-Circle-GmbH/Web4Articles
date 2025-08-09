[Back to Planning](./planning.md)

# Sprint 0 — Requirements distilled from QA feedback

> Each requirement is tagged for traceability and includes a short example from our chat (problem → fix). Use these to derive and enforce a consistent PO planning process.

- [x] Enforce PlantUML correctness and CLI rendering workflow  
  [requirement:uuid:7e3a9d65-8f2e-4b7a-bb1c-9f2c3b7e1a4f]
  > Problem: Diagram failed with “Assumed diagram type: sequence”.  
  > Fix: Converted single-line class bodies to multiline, added `skinparam classAttributeIconSize 0`, proper realization arrows, and introduced `ParseArgs`. Added Architect procedure with `plantuml -tsvg -failfast2` and `-checkonly` commands. Artifacts embedded in tasks.

- [x] DevOps environment verification before work  
  [requirement:uuid:1c2f4a88-0d5b-4b3e-9a6f-5e2c8f1d3b77]
  > Problem: Missing PlantUML/Graphviz and engine mismatches blocked rendering/tests.  
  > Fix: Added README and DevOps process checks (Docker, devcontainer, Node engines, PlantUML/Graphviz, gh). Planned Sprint 4 devcontainer and opened PR branch.

- [x] Embed generated SVGs and add explicit Artifacts sections  
  [requirement:uuid:a5d2c1f0-7b3a-4c9e-8d2e-1f3a5b7c9d0e]
  > Problem: PUML artifacts not discoverable; tasks lacked embedded diagrams.  
  > Fix: Embedded `src/puml/*.svg` in Architect task and added Artifacts sections/links across Sprint 3 tasks.

- [x] First-line backlink policy for all markdown  
  [requirement:uuid:9b1d2c3e-4f5a-4b6c-8d7e-1a2b3c4d5e6f]
  > Problem: Inconsistent navigation and missing backlinks.  
  > Fix: Added mandatory policy to ScrumMaster process and updated all Sprint 3/Sprint 2 tasks to start with `[Back to Planning](./planning.md)`.

- [x] Bidirectional traceability with UUIDs between requirements and tasks  
  [requirement:uuid:f3a1c2b4-5d6e-4f7a-8b9c-0d1e2f3a4b5c]
  > Problem: Hard to map tasks to originating requirements.  
  > Fix: Added `[requirement:uuid:<uuidv4>]` in tasks linking to `requiremnents.md` and appended the same UUID with a link to the task inside `requiremnents.md`. Updated PO process.

- [x] MAIN/SUBTASK scheme and numbering rules  
  [requirement:uuid:2a4c6e80-d1f2-4b3c-9a6e-7b8c9d0e1f2a]
  > Problem: Mixed numbering (“Task 8” vs file `task-1.7`), duplicate numbers.  
  > Fix: Introduced MAIN tasks (`task-N`) from requirements, with role-specific SUBTASKS (`task-N.M`), no refinement in subtasks. Refactored Sprint 2 planning and file names consistently.

- [x] Continuous merge health checks  
  [requirement:uuid:4d5e6f70-1a2b-4c3d-8e9f-0a1b2c3d4e5f]
  > Problem: Unknown post-merge state.  
  > Fix: Ran `npm test` end-to-end; recorded green state and logged in `recovery.md`.

- [x] Safe integration test for GitScrumProject repo creation  
  [requirement:uuid:0a1b2c3d-4e5f-4a6b-8c9d-0e1f2a3b4c5d]
  > Problem: Real network ops not suitable for CI.  
  > Fix: Added DRY_RUN behavior and a Vitest that asserts dry-run output; adjusted arg parsing to pass.

- [x] TSRanger runtime stability and ergonomics  
  [requirement:uuid:5b6c7d8e-9f01-4a2b-8c3d-4e5f6a7b8c9d]
  > Problem: Opaque ESM loader errors; missing view helpers.  
  > Fix: Implemented `buildColoredCommand`, footer helpers, and error handling; added Alt+Q exit mode and scripted test mode to simulate keystrokes.

- [ ] TSRanger column selection alignment  
  [requirement:uuid:6c7d8e9f-0123-4b5a-8c7d-9e0f1a2b3c4d]
  > Problem: Selected row overwrote adjacent titles (`GitScrumProjectoverlayRun`).  
  > Fix Plan: Pad/truncate within `colWidth`; created subtask `sprint-2/task-2.3-developer-fix-selected-row-indentation.md`.

- [ ] Footer spacing and bottom anchoring  
  [requirement:uuid:8e9f0a1b-2345-4c6d-8e9f-0a1b2c3d4e5f]
  > Problem: Footer/help line not guaranteed to use full width or remain at bottom; missing blank lines around preview.  
  > Fix Plan: MAIN Task 2 with subtasks 2.1 (layout/spacing) and 2.2 (colorized preview) in Sprint 2.

- [ ] Shell-like command prompt in preview  
  [requirement:uuid:9f0a1b2c-3456-4d7e-8f90-1a2b3c4d5e6f]
  > Problem: Preview lacked familiar prompt; PS1 not respected.  
  > Fix Plan: MAIN Task 3 (subtask 3.1) to read `$PS1` or synthesize `[hostname] user@pwd`.

---

Use these as the canonical baseline for PO planning. Each new requirement must:
- Receive a UUID, be added here with a short problem/fix quote, and be realized as a MAIN task with role-specific SUBTASKS as needed.
- Be linked bidirectionally (this file ↔ tasks) per PO process.
- Each MAIN task and SUBTASK must include a UUID tag on its own first lines using `[task:uuid:<uuidv4>]` (for MAIN) or `[subtask:uuid:<uuidv4>]` (for SUBTASKS).

---

## Additional requirements derived from recent commits

- [x] Avoid duplicate subtask lists in planning; list subtasks only under their MAIN task  
  [requirement:uuid:af2d9c54-5f2a-4782-9e2d-6f1a2b3c4d5e]
  > Problem (commit eac8c3d): Planning showed a redundant standalone “Task 1.*” list in addition to the SUBTASKS beneath MAIN Task 1.  
  > Fix: Removed the duplicate list; kept a single SUBTASKS block under MAIN Task 1.

- [x] Consistent Task 1 subtask numbering (1.1..1.7) with updated links  
  [requirement:uuid:b3c8d9ea-1f24-4a56-9b7c-0d1e2f3a4c5b]
  > Problem (commit e497525): Subtask numbers conflicted and did not align with filenames.  
  > Fix: Renamed files and headers to 1.1..1.7 and updated planning links accordingly.

- [x] MAIN Task 1 promotion and regrouping of related work under appropriate MAIN tasks  
  [requirement:uuid:c4d5e6f7-2a3b-4c5d-9e0f-1a2b3c4d5e6f]
  > Problem (commit ca02bde): Architect spec was not clearly a MAIN task; an issue fix lived outside the right group.  
  > Fix: Promoted architect spec to `task-1.md` and grouped the indentation fix under MAIN Task 2 as subtask 2.3; refreshed planning and requirements links.

- [x] Ensure each MAIN task has a dedicated file with full template and subtasks referenced  
  [requirement:uuid:d5e6f7a8-3b4c-4d5e-9f01-2a3b4c5d6e7f]
  > Problem (commit 7be8bfb): Some MAIN tasks existed only implicitly via subtasks.  
  > Fix: Added `task-2.md` with full status/template and linked from planning; listed its subtasks beneath it.

- [x] PO process must define and enforce MAIN/SUBTASK numbering; filenames and headers must match labels  
  [requirement:uuid:e6f7a8b9-4c5d-4e6f-9012-3a4b5c6d7e8f]
  > Problem (commit 3c79f29, 2128395, 4f60b98, da2cbaf): Planning and filenames used mixed schemes (e.g., “Task 8” vs `task-1.7`), tasks lacked template sections/status.  
  > Fix: Clarified PO process; reconciled numbering with filenames and normalized all tasks to the PO template with accurate statuses.

- [x] Bidirectional traceability via UUIDs must be updated when tasks are renamed or regrouped  
  [requirement:uuid:f7a8b9c0-5d6e-4f90-8123-4b5c6d7e8f90]
  > Problem (commits 4720825, 9533498): Renames/regrouping can desync links between requirements and tasks.  
  > Fix: Enforced appending UUID and task links in `requiremnents.md` and task files; updated PO process to require atomic link updates with structural edits.

