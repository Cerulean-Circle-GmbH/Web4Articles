# CMM3 Compliance Checklist

**🗓️ Updated:** 2025-10-14-UTC-1516 - QA Decisions format compliance check added (1j) + Link fixes from 0940 session  
**CMM Definitions:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/save/cmm-start/scrum.pmo/project.journal/2025-09-22-UTC-1908-session/howto.cmm.md) | [scrum.pmo/project.journal/2025-09-22-UTC-1908-session/howto.cmm.md](../../project.journal/2025-09-22-UTC-1908-session/howto.cmm.md)
**⚠️ CMM Level:** Lowest compliance element determines overall level

1. **PDCA Compliance**
   - [ ] a) Template version 3.2.4.2 exact match: [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/scrum.pmo/roles/_shared/PDCA/template.md) | [§/scrum.pmo/roles/_shared/PDCA/template.md](../_shared/PDCA/template.md)
   - [ ] b) Real UTC time verification: Run `date -u` command and copy exact output to PDCA header. **WHY:** Prevents hallucination, ensures CMM3 reproducibility, creates verifiable audit trail. **Anti-Pattern:** Never guess/fabricate timestamps - always verify with actual command execution. **Verification:** Timestamp format matches `date -u` output exactly (e.g., "Tue Oct 14 03:24:03 PM UTC 2025"). See assumption detection protocol: [GitHub](https://github.com/CeruleanCircle/Web4Articles/blob/dev/2025-10-16-UTC-0918/scrum.pmo/project.journal/2025-10-16-UTC-1310-session/2025-10-16-UTC-1405.assumption-detection-self-reflection-breakthrough.pdca.md) | [§/scrum.pmo/project.journal/2025-10-16-UTC-1310-session/2025-10-16-UTC-1405.assumption-detection-self-reflection-breakthrough.pdca.md]
   - [ ] c) All 6 sections with horizontal separators (see template, not duplication)
   - [ ] d) All sections: exact template format, no modifications
   - [ ] e) Working dual links, no "TBD" placeholders
   - [ ] f) 11-step PDCA process (start with todo_write tool immediately):
        **CRITICAL: Create ALL 11 steps in todo_write FIRST before any execution. Never create partial todo lists.**
        **MANDATORY 1f PROTOCOL:** Every agent must use systematic 11-step process with todo_write tracking in first PDCA. No exceptions.
        **DECISION RECOGNITION:** When encountering unexpected findings, incomplete research, or ambiguous situations, IMMEDIATELY present QA Decisions to TRON rather than reporting autonomously. Examples: undocumented features, incomplete documentation, conflicting information, technical uncertainties.
     1. Progress tracking requirement: Update tracking tables in CHECK section showing progress, use todo_write to track status, mention in chat if stopping incomplete for continuation prompt  
     1. Interrupt this process immediately on total unexpeded observations or amgiguities and ask TRON. after the answer contionue.
     1. start with the header and the plan section
     1. plan with expected output
     1. do what you planned with savety protocoll
     1. document what you did with command quotes in the do section
     1. write how you will check it in the check section and what outputs you need to verify how with command quotes
     1. check if you achieved the expected output
     1. write what as achieved and what is not yet achieved
     1. write a todolist with your internal write todo tool what to continue to check and fix
     1. act on the todolist and check again
     1. when achieved all expected output, write the rest of the pdca e.g. emotional section
     1. finally do the git protocol

   - [ ] g) CMM3 violation reporting: When detecting violations in your PDCA or previous PDCAs, report to chat/TRON with specific citation using format "[number][letter] cmm2" (e.g., "2a cmm2" for trigger command violation, "1b cmm2" for hallucinated timestamp). **WHAT to report:** Any checklist item failure, broken links, missing sections, incorrect formats. **HOW to report:** 1) Cite violation using checklist reference, 2) Provide dual link to violated PDCA, 3) Explain what's wrong, 4) Propose fix or ask for guidance. **Example:** "Found 1b cmm2 violation in previous PDCA - timestamp appears hallucinated, not from `date -u` output. Should I fix with real timestamp?" See protocol: [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/scrum.pmo/roles/_shared/PDCA/howto.PDCA.md) | [§/scrum.pmo/roles/_shared/PDCA/howto.PDCA.md](../_shared/PDCA/howto.PDCA.md)
   - [ ] h) Understanding research requirement: Research unknown terms/processes before use or ask TRON if research fails - Add intense use of tracking tables for artifacts and task lists in plan section
   - [ ] i) Git commit & push protocol: One-liner commit `git commit -m "PDCAfilename.pdca.md"` then ALWAYS push `git push` - GitHub dual links REQUIRE push to be accessible
   - [ ] j) QA Decisions format: Must include one of these valid patterns per [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/scrum.pmo/roles/_shared/PDCA/PDCA.howto.decide.md) | [§/scrum.pmo/roles/_shared/PDCA/PDCA.howto.decide.md](../_shared/PDCA/PDCA.howto.decide.md)
     1. **Pending decisions** (awaiting TRON input): `[ ] **Decision 1:** Description` with options a/b/c
     2. **Completed decisions** (TRON answered, implemented): `[x] **Decision 1:** Description` with ✅ implementation note
     3. **No decisions needed**: "All clear, no decisions to make - [reason]"
     
     **Decision lifecycle:** Pending `[ ]` → TRON answers → Agent implements → Completed `[x]`
**MANDATORY: Research existing Web4 tools FIRST before any programming. If research fails, ASK TRON. NEVER program without explicit request.**

1. **Trigger Command Recognition**
**CRITICAL: "stop" = IMMEDIATE EMERGENCY HALT - No git operations, no PDCA completion, ask "what's up?" immediately**
   - [ ] a) "start" trigger: Session initialization with PDCA workflow establishment per [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/recovery/start-command.md) | [§/recovery/start-command.md](../../../recovery/start-command.md)
   - [ ] b) "pdca" trigger: CMM3 compliance check and correction enforcement - Use CMM3 checklist to verify last PDCA and fix violations, then create new PDCA using checklist and 1f process per [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/scrum.pmo/roles/_shared/PDCA/howto.PDCA.md) | [§/scrum.pmo/roles/_shared/PDCA/howto.PDCA.md](../_shared/PDCA/howto.PDCA.md)  
   - [ ] c) "noop" trigger: No action - Cursor PWA display bug workaround per [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/scrum.pmo/project.journal/2025-09-23-UTC-1052-session/2025-09-23-UTC-1548-howto-pdca-noop-trigger-addition.pdca.md) | [§/scrum.pmo/project.journal/2025-09-23-UTC-1052-session/2025-09-23-UTC-1548-howto-pdca-noop-trigger-addition.pdca.md](../../project.journal/2025-09-23-UTC-1052-session/2025-09-23-UTC-1548-howto-pdca-noop-trigger-addition.pdca.md)
   - [ ] d) "pull" trigger: PDCA content analysis protocol - Read + Analyze + PDCA new content per [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/scrum.pmo/project.journal/2025-09-10-UTC-1953-session/2025-09-10-UTC-2150-pull-protocol-update-new-files-analysis.md) | [§/scrum.pmo/project.journal/2025-09-10-UTC-1953-session/2025-09-10-UTC-2150-pull-protocol-update-new-files-analysis.md](../../project.journal/2025-09-10-UTC-1953-session/2025-09-10-UTC-2150-pull-protocol-update-new-files-analysis.md)
   - [ ] e) "stop" trigger: Emergency halt protocol - Immediate stop all operations, no git/PDCA completion, ask "what's up?" per [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/scrum.pmo/roles/_shared/PDCA/howto.PDCA.md) | [§/scrum.pmo/roles/_shared/PDCA/howto.PDCA.md](../_shared/PDCA/howto.PDCA.md)

1. **Chat Response Compliance**  
   - [ ] a) Links only, no explanatory text per [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/scrum.pmo/roles/_shared/PDCA/howto.PDCA.md) | [§/scrum.pmo/roles/_shared/PDCA/howto.PDCA.md](../_shared/PDCA/howto.PDCA.md)
   - [ ] b) QA Decisions copied verbatim from PDCA per [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/scrum.pmo/roles/_shared/PDCA/PDCA.howto.decide.md) | [§/scrum.pmo/roles/_shared/PDCA/PDCA.howto.decide.md](../_shared/PDCA/PDCA.howto.decide.md)
   - [ ] c) Dual link format: [GitHub](URL) | [§/path](path) per [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/scrum.pmo/roles/_shared/PDCA/PDCA.dual.link.format.requirement.md) | [§/scrum.pmo/roles/_shared/PDCA/PDCA.dual.link.format.requirement.md](../_shared/PDCA/PDCA.dual.link.format.requirement.md)
   - [ ] d) Finally apply cmm3 compliant format to the chat report:
     **MANDATORY VALIDATION:** Before sending chat report, verify against chat.report.template.md
     **Forcing Function Checklist:**
     - [ ] 3a: Links only, no explanatory text (no summaries, metrics, verbose descriptions)
     - [ ] 4c: Dual link uses project-root-relative path (NO `file://` prefix)
     - [ ] 3c: Format is `[GitHub](URL) | [§/path](path-from-root)`
     - [ ] 3b: QA Decisions copied verbatim from PDCA (not paraphrased)
     - [ ] 1g: Violations cited as "[#][letter] cmm2" if any exist
     - [ ] Link tested and works when clicked
     **If ANY checkbox unchecked → FIX before sending**
     **Template:** [GitHub](https://github.com/CeruleanCircle/Web4Articles/blob/dev/2025-10-16-UTC-0918/scrum.pmo/roles/_shared/PDCA/chat.report.template.md) | [§/scrum.pmo/roles/_shared/PDCA/chat.report.template.md](../_shared/PDCA/chat.report.template.md)

1. **Link Compliance**
   - [ ] a) GitHub URLs work after git push per [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/scrum.pmo/roles/_shared/PDCA/PDCA.dual.link.format.requirement.md) | [§/scrum.pmo/roles/_shared/PDCA/PDCA.dual.link.format.requirement.md](../_shared/PDCA/PDCA.dual.link.format.requirement.md)
   - [ ] b) PDCA local links: relative from document location
   - [ ] c) Chat local links: absolute from project root
   - [ ] d) § notation for root path display

1. **Naming/Location**
   - [ ] a) YYYY-MM-DD-UTC-HHMM.pdca.md format only
   - [ ] b) Role directory: scrum.pmo/roles/[AgentRole]/pdca/
   - [ ] c) No descriptive text in filename

1. **Authorization**
   - [ ] a) NEVER SELF ASSIGN A CMM BADGE - Only TRON assigns badges; always document the current badge (assigned by TRON) in the PDCA header
   - [ ] b) Only explicit user-authorized work
   - [ ] c) Present decisions when direction unclear per [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/scrum.pmo/roles/_shared/PDCA/PDCA.howto.decide.md) | [§/scrum.pmo/roles/_shared/PDCA/PDCA.howto.decide.md](../_shared/PDCA/PDCA.howto.decide.md)
**WARNING: Never create fake opposites like "do it vs don't do it" - Only present decisions for REAL RISKS with multiple valid approaches**
   - [ ] d) No assumptions about user intent

1. **Markdown Quality**
   - [ ] a) All numbered lists use "1." for each item (not 1. 2. 3.) - HTML auto-numbers correctly, prevents confusion when inserting/deleting items
   - [ ] b) Agent self-check: Can modify list order without manual renumbering

1. **Document Reading and Link Validation Protocol**
**CRITICAL: Broken link = immediate error signal. REPORT and STOP, never assume content.**
   - [ ] a) Startup link validation: READ and TEST all instruction document links (README, Checklist, referenced protocols). If link broken → REPORT immediately: "Cannot access [doc], link broken at [location]" → STOP and ASK TRON for fix. Never assume broken document content. Per [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-10-14-UTC-0940/scrum.pmo/project.journal/2025-10-14-UTC-0940-session/2025-10-14-UTC-1447.link-validation-startup-behavior.pdca.md) | [§/scrum.pmo/project.journal/2025-10-14-UTC-0940-session/2025-10-14-UTC-1447.link-validation-startup-behavior.pdca.md](../../project.journal/2025-10-14-UTC-0940-session/2025-10-14-UTC-1447.link-validation-startup-behavior.pdca.md)
   - [ ] b) Broken link handling: Treat broken links as ERROR signals, not gaps to fill with imagination. Report: "Link broken: [specific link]" → Stop process → Ask TRON for resolution → Resume after fix verified
   - [ ] c) Reading depth requirement: Read ALL relevant documents to depth 3 (document → referenced docs → their references). Applies to: startup instructions, user-provided links, protocol references, ANY input requiring understanding. Depth 3 ensures: Level 0 (entry), Level 1 (direct refs), Level 2 (secondary refs), Level 3 (deep context). Validate all links at each depth.
   - [ ] d) Continuous validation: Apply reading depth 3 + link validation to ANY relevant input throughout session, not only startup. When user provides link, instruction, or reference → Read depth 3 → Validate all links → Report broken ones immediately.
   - [ ] e) Impact understanding: Read analysis PDCA explaining why this protocol exists. Shallow reading + unvalidated links = knowledge gaps = violations during work. See [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-10-14-UTC-0940/scrum.pmo/project.journal/2025-10-14-UTC-0940-session/2025-10-14-UTC-1447.link-validation-startup-behavior.pdca.md) | [§/scrum.pmo/project.journal/2025-10-14-UTC-0940-session/2025-10-14-UTC-1447.link-validation-startup-behavior.pdca.md](../../project.journal/2025-10-14-UTC-0940-session/2025-10-14-UTC-1447.link-validation-startup-behavior.pdca.md)

**Usage:** Cite violations as "[number][letter] cmm2" (e.g., "2a cmm2")  
**Recovery:** Fix violation, verify entire checklist, continue

**"Death is not the end, but a chance for rebirth with wisdom"** 🔄✨
