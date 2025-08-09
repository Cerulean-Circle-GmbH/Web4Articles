[Back to Planning](./planning.md) | [Back to Task 1](./task-1.md)

# Task 1.6: ScrumMaster — Add CI Step to Build/Use Devcontainer for Validation
[subtask:uuid:d0e1f2a3-b4c5-4d6e-8f9a-0b1c2d3e4f5a]

## Status
- [ ] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [requirement:uuid:0f1e2d3c-4b5a-6c7d-8e9f-0a1b2c3d4e5f](./requiremnents.md)
  - [requirement:uuid:9c8d7e6f-5a4b-3c2d-1e0f-9a8b7c6d5e4f](./requiremnents.md)
  - [Task 1](./task-1.md)

## Task Description
Add a CI workflow job that builds the devcontainer and runs `npm test` and a `plantuml -checkonly` or render step to validate environment parity. No image push.

## Steps
- Define a CI job using Actions or equivalent to build and run inside the devcontainer
- Execute tests and PUML validation as part of the job

## Acceptance Criteria
- CI job runs on PRs and main, building the devcontainer and validating tests/PUML
- No registry publishing occurs in this sprint

## QA Audit & User Feedback
- [ ] [UTC timestamp] QA review pending.
- [ ] [UTC timestamp] Feedback to be collected after subtask completion.