<!--
SPDX-License-Identifier: AGPL-3.0-only + AI-GPL-Addendum
Copyright (c) 2025 The Web4Articles Authors
Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
Backlinks: /LICENSE , /AI-GPL.md
Use of `scrum.pmo` roles/process docs with AI is subject to AI-GPL copyleft unless dual-licensed.
-->

[Back to Index](./index.md)

## 2025-08-11 18:45 UTC - Achievement Recognition

**QA Feedback**: "big achievement docum it in your project status folder. also ad a qa comment: WELL DONE!👍"

**Context**: After achieving 100% branch coverage in release/dev by:
- Implementing PR-based workflows
- Creating feature-to-dev.yml for automatic CI
- Manually merging the missing licensing branch
- Verifying all 21 remote branches are integrated

**Response**: 
- Documented achievement in `/scrum.pmo/project.journal/2025-08-11-1641/project.state.md`
- Updated project status with major achievement section
- Added comprehensive list of created artifacts
- Recorded QA feedback with timestamp

**Achievement**: Successfully transformed release/dev into a true continuous integration environment with complete branch coverage and automation for future branches.

---

[Back to Index](./index.md)

# QA Feedback Log (2025-08-06)

- 2025-08-04 — sprint-1/task-1.0-architect-tssh-spec.md:
  - Issue: PlantUML mixed sequence and component/package elements in one diagram; confusing and invalid.
  - Resolution: Split into two PUML files and reference both in artifacts:
    - docs/puml/tssh-architecture.puml (Sequence/Flow)
    - docs/puml/tssh-architecture-structure.puml (Component/Package)
  - Outcome: Clearer onboarding and maintainability.

- 2025-08-03 — sprint-0/task-5.2-developer-implementation.md:
  - Issue: Completion script failed across directories due to TS_NODE_PROJECT path handling.
  - Gap: Automated tests did not simulate real shell usage; bug escaped CI.
  - Finding: After suppressing Node warnings, shell still showed no completions.
  - Action Items: Fix shell/backend so completions appear; add an end-to-end shell completion test covering env and cwd.

- Multiple sprint tasks/templates:
  - QA review pending placeholders remain; collect and append concrete feedback after execution.

*Update this file as new QA feedback is received or audits are performed.*

- 2025-08-08 — sprint-2/task-1.6-developer-refactor-tsranger.md:
  - Issue: Classes extracted but placed in incorrect layers (model should be in `layer2`, controller in `layer4`, view in `layer5`).
  - Resolution: Move `RangerModel` to `src/ts/layer2/`, `RangerController` to remain in `src/ts/layer4/`, and `RangerView` to `src/ts/layer5/`; update imports accordingly.
  - Outcome: Code aligns with project layering principles without behavior change; tests remain green.


- 2025-08-10T09:33:46Z — Project Retro Scheduling:
  > not bad. add  qa questions. what topic was the elephant in the room, that became an obvious obstacle but was not chatted about. which elephant in the room was discovered and named as a major obstacle. where solutions provided or described by qa. where where the solution approaches documented.
  > 
  > the existing questions in the interview file are perfect, but they shall be in the retro instruction file, that every agent should read. the instruction file shall not repeat the questions rephrased but have them as the single source of truth for each agent. the interview file shall be a prompt as short as possible just telling the agent what to read to understand. it needs to make clear that the agent has to commit his answer to the branch and the location unambiguously. the agent needs to make sure he can switch to that branch without losing uncommitted parts in his current branch or state. add this to the project qa feedback and rewrite both files.
  - Spelling-corrected summary (post-quote): Add QA questions on "elephant in the room" obstacles, solutions, and documentation references. Consolidate all interview questions in `retro-instructions.md` as the source of truth; keep `agent-interview.md` a minimal prompt that directs agents to read instructions and commit answers (ensuring safe branch switch) to the specified retro folder/branch.
  
## 2025-08-10T09:05:19Z
> mark this release as a beta release. you did very well to prvent the release and it si the good default behaviour. but we will do a project retro after this release to figure out how we came in this state where you are endlessly trying to fix this test and then teach the process improvements to you to prevent such situations. add this to the sprint 2 qa.feedback as text copy from my ppompt. always copy my feedback 1:1 from the promt into the qa.md with utc timestamp. after you quoted my you can fix spelling errors only, because you can type faster than me and if i type fast i sometimes hit the wrong keys...

## 2025-08-10T09:20:00Z
> ok. currently a lot of agents are open. create a new branch from main for the scheduled project retro. in it add a retro folder under the todays journal entry folder. then add there two files: 1. retro-instructions.md and 2. agent-interview.md
> the agent interview is a prompt that i put into each agent. its should inform the agent about the retro branch and ask it to answer several questions and write an answer.[agent-name].md file into that directory.
>  each of the agent recovered from the readme, but had then to do specialized tasks. ask each agent how it whould have described its role after recoering as a scrum master. let the agent add a setiles role description section to his hanswer. ask him what was achieved. what where recourring problems. each answer to these questions needs to be a section in teh answer file. each sections shall have subsections with detailed problem descriptions and examples. what qa comments where helpfull, which where confusing.
>
> agent-interview.md ist the prompt i copy to every angent. that should refer to the retro-instructions.md for DRY reasons. if you have sp[ecific good questions for the agent to add do so and not them as scrum-mater questions. note my as qaquestions.

## 2025-08-10T09:33:46Z
> not bad. add  qa questions. what topic was the elephant in the room, that became an obvious obstacle but was not chatted about. which elephant in the room was discovered and named as a major obstacle. where solutions provided or described by qa. where where the solution aproaches documented.
>
> the existing questions in the interview file are perfect, but they ahsll be in the retro instuction file, that every agent should read. the instruction file shall not repead the questions rephreased but have them as the single source of truth for each agent. the interview file shall be a promt as short as possible just telling the agent what to read to understand. it needs to make clear that the agent has to comit his answer to the banch and the location unmisunderstandably. the angent needs to make sure he hacn swith to that branch without loosing uncommited parts in his current branch or state. add this to the project qa feedback and rewrite both files.

## 2025-08-10T09:40:00Z
> add this projects github origin into the Agent Interview Prompt  as we are also using it in a multi submodule governance project with multiple repositories.
- 2025-08-10T09:33:46Z — Project Retro Scheduling:
  > not bad. add  qa questions. what topic was the elephant in the room, that became an obvious obstacle but was not chatted about. which elephant in the room was discovered and named as a major obstacle. where solutions provided or described by qa. where where the solution approaches documented.
  > 
  > the existing questions in the interview file are perfect, but they shall be in the retro instruction file, that every agent should read. the instruction file shall not repeat the questions rephrased but have them as the single source of truth for each agent. the interview file shall be a prompt as short as possible just telling the agent what to read to understand. it needs to make clear that the agent has to commit his answer to the branch and the location unambiguously. the agent needs to make sure he can switch to that branch without losing uncommitted parts in his current branch or state. add this to the project qa feedback and rewrite both files.
  - Spelling-corrected summary (post-quote): Add QA questions on "elephant in the room" obstacles, solutions, and documentation references. Consolidate all interview questions in `retro-instructions.md` as the source of truth; keep `agent-interview.md` a minimal prompt that directs agents to read instructions and commit answers (ensuring safe branch switch) to the specified retro folder/branch.

## 2025-08-12 1039 UTC - QA Feedback Aggregation during Recovery

**Summary**: Aggregated QA feedback from all task QA sections and sprint audit files. No new substantive feedback beyond existing entries. Verified "## QA Audit" sections across sprints; most are placeholders or empty. Preserved key recent feedbacks from sprint-9 on merge strategies.

**Details**:
- sprint-9/task-9.7: QA feedback files successfully merged using additive strategy (4 instances); noted duplicates for cleanup.
- sprint-9/task-9.22: QA feedback successfully preserved with additive merge.
- Older feedbacks (e.g., from sprint-0 to sprint-5) already documented in this log.

**Action**: Log updated; ready for incorporation into next sprint planning.

---
