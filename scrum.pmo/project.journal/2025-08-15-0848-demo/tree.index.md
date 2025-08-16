[Back to Project State](./project.state.md)

# Repository Tree Index — 2025-08-15-0848-demo UTC

```
.
|-- .cspell.json
|-- .github
|   |-- chatmodes
|   |   `-- ScrumMaster2QA.chatmode.md
|   `-- workflows
|       |-- auto-merge-release-dev.yml
|       |-- branch-cleanup-report.yml
|       |-- eod-merge.yml
|       |-- feature-to-dev.yml
|       |-- license-headers.yml
|       |-- quality-checks.yml
|       |-- roles-auto-pr.yml
|       |-- roles-pr-scan.yml
|       `-- sync-production.yml
|-- .gitignore
|-- .gitmodules
|-- .vscode
|   `-- extensions.json
|-- AI-GPL.md
|-- COMMIT_PUSH_POINT.md
|-- Documentation
|   |-- Glossary.md
|   |   |-- Actor.md
|   |   |-- Agent.md
|   |   |-- Architecture.md
|   |   |-- Backlinks.md
|   |   |-- Business-Process.md
|   |   |-- CMM.md
|   |   |-- Class.md
|   |   |-- Component.md
|   |   |-- Configuration.md
|   |   |-- Cross-linking.md
|   |   |-- Digital-Twin.md
|   |   |-- EAMD.ucp.md
|   |   |-- IOR.md
|   |   |-- Integration.md
|   |   |-- Interface.md
|   |   |-- Interlinking.md
|   |   |-- Kondratjew-Cycles.md
|   |   |-- Lifecycle.md
|   |   |-- Methodology.md
|   |   |-- Namespace.md
|   |   |-- Navigation.md
|   |   |-- ONCE.md
|   |   |-- Object.md
|   |   |-- Paradigm.md
|   |   |-- README.md
|   |   |-- Radical-OOP.md
|   |   |-- References.md
|   |   |-- Reflection.md
|   |   |-- Repository.md
|   |   |-- Self-Sovereign-Identity.md
|   |   |-- Structure.md
|   |   |-- Sustainability-Revolution.md
|   |   |-- Synthesis.md
|   |   |-- Taxonomy.md
|   |   |-- Thinglish.md
|   |   |-- TypeDescriptor.md
|   |   |-- UCP.md
|   |   |-- Use-Case.md
|   |   |-- Web4x.md
|   |   `-- myData-under-myControl.md
|   `-- Ontology.md
|       |-- abbreviation.index.md
|       |-- ambiguities.index.md
|       |-- nouns.index.md
|       |-- ontology.status.md
|       `-- verbs.index.md
|-- LICENSE
|-- README.md
|-- articles
|   `-- medium.com
|       `-- from-chaos-to-component-order.md
|-- components
|   |-- GitScrumProject
|   |   |-- README.md
|   |   `-- v1.0
|   |       |-- src
|   |       |   |-- puml
|   |       |   |   |-- GitScrumProject_CLI_Architecture.puml
|   |       |   |   `-- GitScrumProject_TemplateAndRelease.puml
|   |       |   |-- svg
|   |       |   |   |-- GitScrumProject_CLI_Architecture.svg
|   |       |   |   `-- GitScrumProject_TemplateAndRelease.svg
|   |       |   `-- ts
|   |       |       `-- layer2
|   |       |           `-- GitScrumProject.ts
|   |       `-- test
|   |           `-- gitscrumproject.createTemplateRepo.test.ts
|   `-- TSRanger
|       |-- README.md
|       |-- v1.0
|       |   |-- src
|       |   |   |-- domain
|       |   |   |   |-- SimpleTaskStateMachine.ts
|       |   |   |   `-- TaskStateMachine.ts
|       |   |   |-- sh
|       |   |   |   |-- install.oosh-completion.sh
|       |   |   |   |-- obash
|       |   |   |   |-- oosh
|       |   |   |   |-- oosh-completion.sh
|       |   |   |   |-- tsranger
|       |   |   |   |-- tssh
|       |   |   |   `-- tssh-completion.sh
|       |   |   `-- ts
|       |   |       |-- layer1
|       |   |       |   |-- Logger.ts
|       |   |       |   |-- OOSH.ts
|       |   |       |   |-- ParameterParser.ts
|       |   |       |   `-- TSsh.ts
|       |   |       |-- layer2
|       |   |       |   |-- DefaultCLI.ts
|       |   |       |   |-- LicenseTool.ts
|       |   |       |   |-- RangerModel.ts
|       |   |       |   |-- ResearchAgent.ts
|       |   |       |   `-- TestClass.ts
|       |   |       |-- layer3
|       |   |       |   |-- CLI.ts
|       |   |       |   |-- Completion.ts
|       |   |       |   `-- Project.ts
|       |   |       |-- layer4
|       |   |       |   |-- Completion.ts
|       |   |       |   |-- RangerController.ts
|       |   |       |   |-- TSCompletion.ts
|       |   |       |   `-- TSRanger.ts
|       |   |       |-- layer5
|       |   |       |   `-- RangerView.ts
|       |   |       `-- package.json
|       |   `-- test
|       |       |-- SimpleTaskStateMachine.test.ts
|       |       |-- TSCompletion.test.ts
|       |       |-- TaskStateMachine.parse.test.ts
|       |       |-- licenseTool.spec.ts
|       |       |-- obash.integration.test.ts
|       |       |-- ontology.status.test.ts
|       |       |-- oosh-completion.shell.test.ts
|       |       |-- oosh-completion.test.ts
|       |       |-- tscompletion-cli.integration.test.ts
|       |       |-- tsranger.cursor.test.ts
|       |       |-- tsranger.docs.test.ts
|       |       |-- tsranger.model.test.ts
|       |       |-- tsranger.prompt.test.ts
|       |       |-- tsranger.promptline.behavior.test.ts
|       |       |-- tsranger.tab.test.ts
|       |       `-- tssh-cli.integration.test.ts
|       |-- v2.0
|       |   |-- sh
|       |   |   `-- tsranger
|       |   `-- src
|       |       `-- ts
|       |           |-- layer1
|       |           |   |-- Logger.ts
|       |           |   |-- OOSH.ts
|       |           |   |-- ParameterParser.ts
|       |           |   `-- TSsh.ts
|       |           |-- layer2
|       |           |   |-- DefaultCLI.ts
|       |           |   |-- GitScrumProject.ts
|       |           |   |-- RangerModel.ts
|       |           |   `-- TestClass.ts
|       |           |-- layer3
|       |           |   |-- CLI.ts
|       |           |   |-- Completion.ts
|       |           |   `-- Project.ts
|       |           |-- layer4
|       |           |   |-- Completion.ts
|       |           |   |-- RangerController.ts
|       |           |   |-- TSCompletion.ts
|       |           |   `-- TSRanger.ts
|       |           |-- layer5
|       |           |   `-- RangerView.ts
|       |           `-- package.json
|       |-- v2.5
|       |   |-- src
|       |   |   |-- README.md
|       |   |   |-- sh
|       |   |   |   `-- tsranger
|       |   |   `-- ts
|       |   |       |-- io
|       |   |       |   `-- TerminalIO.ts
|       |   |       |-- layer2
|       |   |       |   `-- RangerModel.ts
|       |   |       |-- layer4
|       |   |       |   |-- RangerController.ts
|       |   |       |   `-- TSRanger.ts
|       |   |       `-- layer5
|       |   |           `-- RangerView.ts
|       |   `-- test
|       |       `-- README.md
|       |-- v3.n14.4
|       |   |-- README.md
|       |   |-- sh
|       |   |   |-- node14
|       |   |   |-- tsranger
|       |   |   `-- tsranger.bash-completion
|       |   `-- tsconfig.n14.json
|       `-- v3.njs14
|           |-- README.md
|           |-- dist
|           |   |-- src.mut
|           |   |   `-- ts
|           |   |       |-- layer1
|           |   |       |   |-- Logger.js
|           |   |       |   |-- OOSH.js
|           |   |       |   |-- ParameterParser.js
|           |   |       |   `-- TSsh.js
|           |   |       |-- layer2
|           |   |       |   |-- DefaultCLI.js
|           |   |       |   |-- GitScrumProject.js
|           |   |       |   |-- RangerModel.js
|           |   |       |   `-- TestClass.js
|           |   |       |-- layer3
|           |   |       |   |-- CLI.js
|           |   |       |   |-- Completion.js
|           |   |       |   `-- Project.js
|           |   |       |-- layer4
|           |   |       |   |-- Completion.js
|           |   |       |   |-- RangerController.js
|           |   |       |   |-- TSCompletion.js
|           |   |       |   `-- TSRanger.js
|           |   |       `-- layer5
|           |   |           `-- RangerView.js
|           |   `-- v2.src.mut
|           |       `-- ts
|           |           |-- layer1
|           |           |   |-- Logger.js
|           |           |   |-- OOSH.js
|           |           |   |-- ParameterParser.js
|           |           |   `-- TSsh.js
|           |           |-- layer2
|           |           |   |-- DefaultCLI.js
|           |           |   |-- GitScrumProject.js
|           |           |   |-- RangerModel.js
|           |           |   `-- TestClass.js
|           |           |-- layer3
|           |           |   |-- CLI.js
|           |           |   |-- Completion.js
|           |           |   `-- Project.js
|           |           |-- layer4
|           |           |   |-- Completion.js
|           |           |   |-- RangerController.js
|           |           |   |-- TSCompletion.js
|           |           |   `-- TSRanger.js
|           |           `-- layer5
|           |               `-- RangerView.js
|           |-- postprocess.mjs
|           |-- sh
|           |   |-- build
|           |   |-- test
|           |   `-- tsranger
|           |-- src.mut
|           |   `-- ts
|           |       |-- layer1
|           |       |   |-- Logger.ts
|           |       |   |-- OOSH.ts
|           |       |   |-- ParameterParser.ts
|           |       |   `-- TSsh.ts
|           |       |-- layer2
|           |       |   |-- DefaultCLI.ts
|           |       |   |-- GitScrumProject.ts
|           |       |   |-- RangerModel.ts
|           |       |   `-- TestClass.ts
|           |       |-- layer3
|           |       |   |-- CLI.ts
|           |       |   |-- Completion.ts
|           |       |   `-- Project.ts
|           |       |-- layer4
|           |       |   |-- Completion.ts
|           |       |   |-- RangerController.ts
|           |       |   |-- TSCompletion.ts
|           |       |   `-- TSRanger.ts
|           |       |-- layer5
|           |       |   `-- RangerView.ts
|           |       `-- package.json
|           |-- tsconfig.njs14.json
|           `-- v2.src.mut
|               `-- ts
|                   |-- layer1
|                   |   |-- Logger.ts
|                   |   |-- OOSH.ts
|                   |   |-- ParameterParser.ts
|                   |   `-- TSsh.ts
|                   |-- layer2
|                   |   |-- DefaultCLI.ts
|                   |   |-- GitScrumProject.ts
|                   |   |-- RangerModel.ts
|                   |   `-- TestClass.ts
|                   |-- layer3
|                   |   |-- CLI.ts
|                   |   |-- Completion.ts
|                   |   `-- Project.ts
|                   |-- layer4
|                   |   |-- Completion.ts
|                   |   |-- RangerController.ts
|                   |   |-- TSCompletion.ts
|                   |   `-- TSRanger.ts
|                   |-- layer5
|                   |   `-- RangerView.ts
|                   `-- package.json
|-- dist
|   |-- Logger.js
|   |-- src
|   |   |-- test
|   |   |   `-- oosh-completion.test.js
|   |   `-- ts
|   |       |-- layer2
|   |       |   |-- GitScrumProject.cli.js
|   |       |   |-- GitScrumProject.js
|   |       |   |-- ParameterParser.js
|   |       |   `-- TestClass.js
|   |       |-- layer3
|   |       |   |-- CLI.js
|   |       |   |-- DefaultCLI.js
|   |       |   `-- Project.js
|   |       `-- layer4
|   |           |-- TSCompletion.js
|   |           `-- main.js
|   `-- test
|       `-- oosh-completion.test.js
|-- docs
|   |-- architecture
|   |   `-- components.md
|   |-- branch-cleanup-policy.md
|   |-- branch-protection-setup.md
|   |-- branching-strategy.md
|   |-- devops-cicd-branching-strategy.md
|   |-- domain
|   |   |-- SimpleTaskStateMachine.md
|   |   |-- TaskStateMachine.md
|   |   |-- daily.json
|   |   |-- daily.md
|   |   `-- planning.md
|   |-- first-principles.md
|   |-- process-migration-log.md
|   |-- puml
|   |   |-- tssh-architecture-structure.puml
|   |   `-- tssh-architecture.puml
|   |-- release-dev-strategy.md
|   |-- tech-stack.md
|   |-- updown-removal-fix-log.md
|   |-- user-guide
|   |   `-- GitScrumProject.md
|   `-- versioned-units.md
|-- handover.backend.agent.md
|-- index.md
|-- index.md.backup
|-- merge-log-20250811-142752.txt
|-- merge-report-20250811-142753.md
|-- merge-report-sprint-9.md
|-- package-lock.json
|-- package.json
|-- projects
|   |-- AI.Agent.setup
|   `-- EAMD.ucp
|       `-- readme.md
|-- qa-feedback-log.md
|-- recovery.md
|-- scripts
|   |-- cleanup-merged-branches.sh
|   |-- release-to-testing.sh
|   |-- update-project-index.sh
|   `-- verify-release.sh
|-- scrum.pmo
|   |-- project.journal
|   |   |-- 2025-08-10-0854
|   |   |   `-- project.state.md
|   |   |-- 2025-08-10-1030
|   |   |   |-- branches.checklist.md
|   |   |   |-- project.state.md
|   |   |   `-- retro
|   |   |       |-- 01.retro-instructions.what.md
|   |   |       |-- 02.retro-status.overview.md
|   |   |       |-- 04.agent-interview.md
|   |   |       |-- 99.retro-measures.action.md
|   |   |       |-- agent-interview.md
|   |   |       |-- answer.BackendMaestro-1.md
|   |   |       |-- answer.BranchStatus-Agent-1.md
|   |   |       |-- answer.BranchStatus-Agent-2.md
|   |   |       |-- answer.DevContainer-Cartographer-1.md
|   |   |       |-- answer.DevcontainerCartographer.md
|   |   |       |-- answer.OntologyWeaver.md
|   |   |       |-- answer.PromptlineConductor.md
|   |   |       |-- answer.ReleaseIntegrator-1.md
|   |   |       |-- answer.ResearchArchitect.md
|   |   |       |-- answer.TSRanger-Developer.md
|   |   |       |-- answer.agent-SprintRanger-01.md
|   |   |       |-- answer.agent-SprintRanger-02.md
|   |   |       |-- answer.assistant.md
|   |   |       |-- answer.broken.md
|   |   |       |-- answer.developer-learningVersioning.md
|   |   |       |-- answer.gpt-5.md
|   |   |       `-- answer.retro-agent.md
|   |   |-- 2025-08-11-0955
|   |   |   |-- branch-overview.md
|   |   |   `-- project.state.md
|   |   |-- 2025-08-11-0957
|   |   |   `-- project.state.md
|   |   |-- 2025-08-11-1641
|   |   |   |-- answer.BranchFlowArchitect.md
|   |   |   |-- branch-overview.dev.md
|   |   |   |-- branch-overview.md
|   |   |   `-- project.state.md
|   |   |-- 2025-08-12-0117
|   |   |   |-- branch-overview.md
|   |   |   `-- project.state.md
|   |   |-- 2025-08-12-0900
|   |   |   `-- project.state.md
|   |   |-- 2025-08-12-0923-recovery
|   |   |   `-- project.state.md
|   |   |-- 2025-08-12-1039
|   |   |   `-- project.state.md
|   |   |-- 2025-08-12-1102
|   |   |   `-- project.state.md
|   |   |-- 2025-08-13-0118
|   |   |   |-- branch-overview.md
|   |   |   `-- project.state.md
|   |   |-- 2025-08-13-0729
|   |   |   |-- branch-overview.md
|   |   |   `-- project.state.md
|   |   |-- 2025-08-13-1022
|   |   |   `-- branch-overview.md
|   |   |-- 2025-08-13-1023
|   |   |   `-- branch-overview.md
|   |   |-- 2025-08-13-1102
|   |   |   |-- branch-overview.md
|   |   |   `-- project.state.md
|   |   |-- 2025-08-13-1526
|   |   |   |-- branch-overview.md
|   |   |   `-- project.state.md
|   |   |-- 2025-08-13-1537
|   |   |   |-- branch-overview.md
|   |   |   `-- project.state.md
|   |   |-- 2025-08-13-1557
|   |   |   |-- branch-overview.md
|   |   |   `-- project.state.md
|   |   |-- 2025-08-14-1617
|   |   |   `-- branch-overview.md
|   |   |-- 2025-08-15-0847-demo
|   |   |   `-- tree.index.md
|   |   `-- 2025-08-15-0848-demo
|   |       |-- project.state.md
|   |       `-- tree.index.md
|   |-- roles
|   |   |-- Architect
|   |   |   |-- PDCA
|   |   |   |   `-- 2025-08-13-UTC-1004.md
|   |   |   `-- process.md
|   |   |-- AuthenticIntegerExperiencialistStoryteller
|   |   |   |-- PDCA
|   |   |   |   `-- 2025-08-13-UTC-2219.md
|   |   |   |-- process.md
|   |   |   `-- quick-reference.md
|   |   |-- BranchStatusAgent
|   |   |   |-- PDCA
|   |   |   |   |-- 2025-08-13-UTC-1004.md
|   |   |   |   |-- 2025-08-13-UTC-1030.md
|   |   |   |   |-- 2025-08-13-UTC-1035.md
|   |   |   |   |-- 2025-08-13-UTC-1042.md
|   |   |   |   |-- 2025-08-13-UTC-1111.md
|   |   |   |   `-- 2025-08-14-UTC-1619.md
|   |   |   |-- process.md
|   |   |   |-- templates
|   |   |   |   |-- README.md
|   |   |   |   |-- branches.checklist.template.md
|   |   |   |   |-- pr-body.cleanup-branches.template.md
|   |   |   |   `-- recovery-note.branch-hygiene.template.md
|   |   |   `-- tools
|   |   |       |-- branch_overview_favorite.sh
|   |   |       |-- branches_checklist_generate.sh
|   |   |       |-- create_pdca.sh
|   |   |       `-- git_branch_counts.sh
|   |   |-- CICDAgent
|   |   |   |-- PDCA
|   |   |   |   `-- 2025-08-15-UTC-0824.md
|   |   |   `-- process.md
|   |   |-- DevOps
|   |   |   `-- PDCA
|   |   |       `-- 2025-08-13-UTC-1004.md
|   |   |-- Developer
|   |   |   |-- PDCA
|   |   |   |   |-- 2025-08-13-UTC-1004.md
|   |   |   |   |-- 2025-08-14-UTC-1708.md
|   |   |   |   |-- 2025-08-14-UTC-1715.md
|   |   |   |   `-- 2025-08-14-UTC-1722.md
|   |   |   `-- process.md
|   |   |-- OntologyAgent
|   |   |   |-- PDCA
|   |   |   |   |-- 2025-08-10-cycle1.md
|   |   |   |   |-- 2025-08-10-cycle2.md
|   |   |   |   |-- 2025-08-10-cycle3.md
|   |   |   |   |-- 2025-08-13-UTC-0846.md
|   |   |   |   |-- 2025-08-13-UTC-0854.md
|   |   |   |   |-- 2025-08-13-UTC-0858.md
|   |   |   |   |-- 2025-08-13-UTC-0908.md
|   |   |   |   |-- 2025-08-13-UTC-0912.md
|   |   |   |   |-- 2025-08-13-UTC-0916.md
|   |   |   |   |-- 2025-08-13-UTC-0918.md
|   |   |   |   |-- 2025-08-13-UTC-1004.md
|   |   |   |   `-- 2025-08-13-UTC-1546.md
|   |   |   |-- process.md
|   |   |   |-- quick-reference.md
|   |   |   `-- templates
|   |   |       |-- README.md
|   |   |       |-- ambiguity-resolution.md
|   |   |       |-- cmm-level4-integration.md
|   |   |       |-- index-update-template.md
|   |   |       `-- ontology-assessment.md
|   |   |-- PO
|   |   |   |-- PDCA
|   |   |   |   |-- 2025-08-13-UTC-1004.md
|   |   |   |   `-- 2025-08-14-UTC-1703.md
|   |   |   |-- process.md
|   |   |   `-- sprint-n-template
|   |   |       |-- planning.md
|   |   |       |-- task-0-example-task.md
|   |   |       `-- task-0.1-example-subtask.md
|   |   |-- ReleaseIntegrationAgent
|   |   |   |-- PDCA
|   |   |   |   |-- 2025-08-13-UTC-1012.md
|   |   |   |   |-- 2025-08-13-UTC-1110.md
|   |   |   |   |-- 2025-08-13-UTC-1114.md
|   |   |   |   |-- 2025-08-13-UTC-1125.md
|   |   |   |   |-- 2025-08-13-UTC-1153.md
|   |   |   |   |-- 2025-08-13-UTC-1155.md
|   |   |   |   |-- 2025-08-13-UTC-1203.md
|   |   |   |   |-- 2025-08-14-UTC-0737.md
|   |   |   |   `-- recover.md
|   |   |   |-- process.md
|   |   |   `-- templates
|   |   |       |-- README.md
|   |   |       |-- checklist.release-integration.md
|   |   |       `-- pr-body.release-integration.md
|   |   |-- ResearchAgent
|   |   |   |-- PDCA
|   |   |   |   |-- 2025-08-10-cycle1.md
|   |   |   |   `-- 2025-08-13-UTC-1004.md
|   |   |   |-- process.md
|   |   |   |-- quick-reference.md
|   |   |   `-- templates
|   |   |       |-- README.md
|   |   |       |-- executive-summary.md
|   |   |       |-- research-request.md
|   |   |       `-- woda-research-document.md
|   |   |-- ScrumMaster
|   |   |   |-- PDCA
|   |   |   |   |-- 2025-08-13-UTC-1707.md
|   |   |   |   |-- 2025-08-13-UTC-1715.md
|   |   |   |   |-- 2025-08-13-UTC-1720.md
|   |   |   |   |-- 2025-08-13-UTC-1725.md
|   |   |   |   |-- 2025-08-13-UTC-1730.md
|   |   |   |   |-- 2025-08-13-UTC-1848.md
|   |   |   |   |-- 2025-08-13-UTC-1904.md
|   |   |   |   |-- 2025-08-13-UTC-1914.md
|   |   |   |   |-- 2025-08-13-UTC-1930.md
|   |   |   |   |-- 2025-08-13-UTC-2003.md
|   |   |   |   |-- 2025-08-13-UTC-2009.md
|   |   |   |   |-- 2025-08-13-UTC-2021.md
|   |   |   |   |-- 2025-08-13-UTC-2027.md
|   |   |   |   |-- 2025-08-13-UTC-2032.md
|   |   |   |   |-- 2025-08-13-UTC-2043.md
|   |   |   |   |-- 2025-08-13-UTC-2056.md
|   |   |   |   |-- 2025-08-13-UTC-2101.md
|   |   |   |   |-- 2025-08-13-UTC-2107.md
|   |   |   |   |-- 2025-08-13-UTC-2118.md
|   |   |   |   |-- 2025-08-13-UTC-2136.md
|   |   |   |   |-- 2025-08-13-UTC-2141.md
|   |   |   |   |-- 2025-08-13-UTC-2158.md
|   |   |   |   |-- 2025-08-13-UTC-2206.md
|   |   |   |   |-- 2025-08-13-UTC-2228.md
|   |   |   |   |-- 2025-08-13-UTC-2235.md
|   |   |   |   |-- 2025-08-13-UTC-2242.md
|   |   |   |   |-- 2025-08-13-UTC-2256.md
|   |   |   |   |-- 2025-08-13-UTC-2307.md
|   |   |   |   `-- 2025-08-14-UTC-1724.md
|   |   |   |-- process.md
|   |   |   `-- recovery-process.md
|   |   |-- Tester
|   |   |   |-- PDCA
|   |   |   |   `-- 2025-08-13-UTC-1004.md
|   |   |   `-- process.md
|   |   `-- _shared
|   |       `-- PDCA
|   |           `-- template.md
|   |-- sprint-registry.yml
|   |-- sprints
|   |   |-- initialization.md
|   |   |-- sprint-0
|   |   |   |-- planning.md
|   |   |   |-- process.ambiguity.md
|   |   |   |-- requiremnents.md
|   |   |   |-- task-0-create-sprint-0-planning-file.md
|   |   |   |-- task-1-create-scrum-structure.md
|   |   |   |-- task-2-setup-wiki-submodule.md
|   |   |   |-- task-3-create-ontology-page.md
|   |   |   |-- task-4-document-role-responsibilities.md
|   |   |   |-- task-5-template-new-subproject.md
|   |   |   |-- task-5.1-architect-puml-spec.md
|   |   |   |-- task-5.2-developer-implementation.md
|   |   |   |-- task-5.3-developer-testing.md
|   |   |   |-- task-5.4-developer-documentation.md
|   |   |   |-- task-5.5-po-planning-acceptance.md
|   |   |   |-- task-5.6-scrummaster-process-verification.md
|   |   |   `-- task-6-devcontainer-requirements.md
|   |   |-- sprint-1
|   |   |   |-- planning.md
|   |   |   |-- task-1-tssh-wrapper.md
|   |   |   |-- task-1.0-architect-tssh-spec.md
|   |   |   |-- task-1.1-developer-tssh-wrapper.md
|   |   |   |-- task-1.1.5-tester-tssh-testcases.md
|   |   |   |-- task-1.2-developer-tssh-backend.md
|   |   |   |-- task-1.3-developer-tssh-completion.md
|   |   |   |-- task-1.4-po-document-tssh.md
|   |   |   `-- task-1.5-tester-completion-tests.md
|   |   |-- sprint-10
|   |   |   `-- plan.md
|   |   |-- sprint-11
|   |   |   |-- planning.md
|   |   |   `-- requiremnents.md
|   |   |-- sprint-12
|   |   |   |-- planning.input.md
|   |   |   |-- planning.md
|   |   |   `-- requirements.md
|   |   |-- sprint-13
|   |   |   |-- planning.md
|   |   |   `-- requirements.md
|   |   |-- sprint-14
|   |   |   |-- planning.md
|   |   |   `-- requirements.md
|   |   |-- sprint-15
|   |   |   |-- authentic-patterns.md
|   |   |   |-- chat-history-authentic.md
|   |   |   |-- planning.md
|   |   |   `-- requirements.md
|   |   |-- sprint-16
|   |   |   |-- planning.md
|   |   |   `-- requirements.md
|   |   |-- sprint-17
|   |   |   `-- planning-preview.md
|   |   |-- sprint-18
|   |   |   |-- complete-chat-history.md
|   |   |   |-- planning.md
|   |   |   `-- requirements.md
|   |   |-- sprint-2
|   |   |   |-- planning.md
|   |   |   |-- requiremnents.md
|   |   |   |-- task-1.1-architect-ranger-spec.md
|   |   |   |-- task-1.2-developer-ranger-tui.md
|   |   |   |-- task-1.3-developer-completion-integration.md
|   |   |   |-- task-1.4-developer-execution-bridge.md
|   |   |   |-- task-1.5-tester-e2e-tests.md
|   |   |   |-- task-1.6-po-user-guide.md
|   |   |   |-- task-1.7-developer-refactor-tsranger.md
|   |   |   |-- task-1.8-developer-parameter-entry.md
|   |   |   |-- task-1.md
|   |   |   |-- task-2.1-developer-footer-height-and-spacing.md
|   |   |   |-- task-2.2-developer-footer-and-color-preview.md
|   |   |   |-- task-2.3-developer-fix-selected-row-indentation.md
|   |   |   |-- task-2.md
|   |   |   |-- task-3.1-developer-command-prompt-ps1.md
|   |   |   |-- task-3.2-developer-prompt-spacing.md
|   |   |   |-- task-3.3-developer-prompt-colors.md
|   |   |   |-- task-3.md
|   |   |   |-- task-4.1-architect-docs-spec.md
|   |   |   |-- task-4.2-developer-tscompletion-docs.md
|   |   |   |-- task-4.3-developer-docs-column.md
|   |   |   |-- task-4.4-tester-e2e-docs.md
|   |   |   |-- task-4.5-po-user-guide-update.md
|   |   |   |-- task-4.md
|   |   |   |-- task-5.1-developer-enrich-jsdoc.md
|   |   |   |-- task-5.2-tester-docs-column-tests.md
|   |   |   |-- task-5.md
|   |   |   |-- task-6.md
|   |   |   |-- task-7.1-developer-promptline-sync.md
|   |   |   |-- task-7.2-tester-scripted-noninteractive.md
|   |   |   |-- task-7.3-developer-env-scenarios.md
|   |   |   |-- task-7.4-developer-keyboard-controller.md
|   |   |   `-- task-7.md
|   |   |-- sprint-3
|   |   |   |-- planning.md
|   |   |   |-- task-1.0-architect-gitscrumproject-spec.md
|   |   |   |-- task-1.1-developer-repo-scaffold.md
|   |   |   |-- task-1.10-developer-https-to-ssh-fallback.md
|   |   |   |-- task-1.11-tester-e2e-lfs-ssh.md
|   |   |   |-- task-1.12-developer-workspaces-mountpoint-manager.md
|   |   |   |-- task-1.13-tester-e2e-workspaces-mountpoint.md
|   |   |   |-- task-1.14-developer-projects-submodule-manager.md
|   |   |   |-- task-1.15-tester-e2e-projects-submodule.md
|   |   |   |-- task-1.2-developer-submodule-runtime.md
|   |   |   |-- task-1.3-devops-release-recovery.md
|   |   |   |-- task-1.4-tester-e2e-tests.md
|   |   |   |-- task-1.5-po-user-guide.md
|   |   |   |-- task-1.6-docs-embed-svgs.md
|   |   |   |-- task-1.7-po-plan-tla-sprint-1.md
|   |   |   |-- task-1.8-developer-gh-auth-and-repo-create.md
|   |   |   |-- task-1.9-developer-lfs-migration-and-push.md
|   |   |   `-- tla-sprint-1-planning.md
|   |   |-- sprint-4
|   |   |   `-- planning.md
|   |   |-- sprint-5
|   |   |   |-- planning.md
|   |   |   |-- qa.md
|   |   |   |-- requiremnents.md
|   |   |   |-- task-1.1-architect-tsranger-v2-spec.md
|   |   |   |-- task-1.2-architect-test-binding-spec.md
|   |   |   |-- task-1.3-architect-qa-learnings-consolidation.md
|   |   |   |-- task-1.4-architect-execution-and-docs-spec.md
|   |   |   |-- task-1.md
|   |   |   |-- task-2.1-architect-srcv2-structure.md
|   |   |   |-- task-2.md
|   |   |   |-- task-3.1-architect-test-matrix.md
|   |   |   |-- task-3.md
|   |   |   |-- task-4.1-architect-puml-sequence.md
|   |   |   |-- task-4.2-architect-puml-structure.md
|   |   |   |-- task-4.3-architect-svg-render.md
|   |   |   |-- task-4.md
|   |   |   |-- task-5-developer-implement-v2.md
|   |   |   |-- task-5.1-developer-io-terminalio.md
|   |   |   |-- task-5.2-developer-model.md
|   |   |   |-- task-5.3-developer-view.md
|   |   |   |-- task-5.4-developer-controller.md
|   |   |   |-- task-5.5-developer-entry-routing.md
|   |   |   |-- task-5.6-devops-shell-toggle.md
|   |   |   |-- task-5.7-developer-integration-smoke.md
|   |   |   |-- task-5.8-developer-keyboard-controller.md
|   |   |   |-- task-5.9-developer-integrate-keyboard-controller.md
|   |   |   |-- task-6-tester-validate-v2-with-existing-tests.md
|   |   |   |-- task-6.1-tester-run-with-toggle.md
|   |   |   |-- task-6.2-tester-triage-and-fix-loop.md
|   |   |   |-- task-6.3-tester-final-green-report.md
|   |   |   `-- task-6.4-tester-keyboard-controller-tests.md
|   |   |-- sprint-6
|   |   |   |-- planning.md
|   |   |   |-- task-1-architect-versioned-structure.md
|   |   |   |-- task-2-developer-migrate-v2-folders.md
|   |   |   |-- task-3-devops-routing-config.md
|   |   |   |-- task-4-tester-validate-v2-suite.md
|   |   |   |-- task-5-po-docs-and-xrefs.md
|   |   |   |-- task-6-architect-componentization-and-submodules.md
|   |   |   |-- task-6.1-developer-refactor-components.md
|   |   |   |-- task-6.2-devops-submodule-setup.md
|   |   |   |-- task-6.3-po-first-principles-update.md
|   |   |   `-- task-6.4-tester-integration-validation.md
|   |   |-- sprint-7
|   |   |   |-- planning.md
|   |   |   |-- qa.md
|   |   |   |-- requiremnents.md
|   |   |   |-- task-1.1-architect-tsranger-v2-spec.md
|   |   |   |-- task-1.2-architect-test-binding-spec.md
|   |   |   |-- task-1.3-architect-qa-learnings-consolidation.md
|   |   |   |-- task-1.4-architect-execution-and-docs-spec.md
|   |   |   |-- task-1.md
|   |   |   |-- task-2.1-architect-srcv2-structure.md
|   |   |   |-- task-2.md
|   |   |   |-- task-3.1-architect-test-matrix.md
|   |   |   |-- task-3.md
|   |   |   |-- task-4.1-architect-puml-sequence.md
|   |   |   |-- task-4.2-architect-puml-structure.md
|   |   |   |-- task-4.3-architect-svg-render.md
|   |   |   |-- task-4.md
|   |   |   |-- task-5-developer-implement-v2.md
|   |   |   |-- task-5.1-developer-io-terminalio.md
|   |   |   |-- task-5.2-developer-model.md
|   |   |   |-- task-5.3-developer-view.md
|   |   |   |-- task-5.4-developer-controller.md
|   |   |   |-- task-5.5-developer-entry-routing.md
|   |   |   |-- task-5.6-devops-shell-toggle.md
|   |   |   |-- task-5.7-developer-integration-smoke.md
|   |   |   |-- task-5.8-developer-keyboard-controller.md
|   |   |   |-- task-5.9-developer-integrate-keyboard-controller.md
|   |   |   |-- task-6-tester-validate-v2-with-existing-tests.md
|   |   |   |-- task-6.1-tester-run-with-toggle.md
|   |   |   |-- task-6.2-tester-triage-and-fix-loop.md
|   |   |   |-- task-6.3-tester-final-green-report.md
|   |   |   `-- task-6.4-tester-keyboard-controller-tests.md
|   |   |-- sprint-8
|   |   |   |-- planning.md
|   |   |   |-- ranger.keyinput.testcases.md
|   |   |   |-- ranger.requirements.md
|   |   |   |-- ranger.tui.behavior.md
|   |   |   |-- requirements.md
|   |   |   |-- tsranger.keyinput.testcases.md
|   |   |   `-- tsranger.tui.behavior.analyzed.md
|   |   |-- sprint-9
|   |   |   |-- daily.md
|   |   |   |-- task-9.22-execute-complete-merge.md
|   |   |   |-- task-9.7-test-merge-execution.md
|   |   |   `-- task-9.8-create-release-testing.md
|   |   `-- sprints.overview.md
|   `-- templates
|       |-- branch-overview.template.md
|       `-- project.state.template.md
|-- sprint-task-conflicts.txt
|-- temp
|   `-- merge.md
|-- tools
|   `-- submodules
|       `-- checkout-branch
|-- tsconfig.json
|-- vitest.config.ts
|-- wiki
|   |-- CMMI.md
|   |-- Home.md
|   `-- Ontology.md
`-- workspacesMountPoint -> ../..
```

*Generated automatically. Not following symbolic links.*

## Key Directories

### Project Structure
- `components/` - Versioned component units (GitScrumProject, TSRanger)
- `scrum.pmo/` - Project management and role processes
- `scripts/` - Automation and CI/CD tools
- `Documentation/` - Project documentation and ontology

### CI/CD & Safety
- `scripts/release-to-testing.sh` - Safe automated releases
- `scripts/verify-release.sh` - Release verification
- `scrum.pmo/roles/CICDAgent/` - Branch safety protocols

### Recent Enhancements
- Enhanced recovery system with role flexibility
- Automated tree indexing (this file)
- Multi-agent coordination safety protocols
- GitHub-integrated project navigation
