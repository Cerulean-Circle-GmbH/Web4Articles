<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ./AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

# AI-GPL Addendum to AGPLv3

**Version:** 1.0  
**Effective Date:** 2025-01-01  
**Copyright Holder:** Cerulean Circle GmbH  
**Homepage:** https://ceruleancircle.com  
**Contact:** licensing@ceruleancircle.com

## 1. Purpose

This addendum extends the GNU Affero General Public License v3.0 (AGPLv3) 
with AI-specific terms to address the unique aspects of human-AI 
collaborative software development and use.

## 2. Scope: Process Artifacts

### 2.1 Definition

"**Process artifacts**" are intellectual property outputs representing 
reproducible, CMM3-compliant methodologies created through human-AI 
collaborative interaction. These include, but are not limited to:

- Plan-Do-Check-Act (PDCA) documents
- Role definitions and process documentation
- Session journals and decision logs
- Collaboration artifacts and meeting notes
- Process templates and checklists
- Methodology documentation

### 2.2 In-Scope Locations

Process artifacts subject to AI-GPL addendum terms are located in:

1. **Primary Location:** `scrum.pmo/` directory and all subdirectories
   - Includes: PDCAs, role definitions, process templates, checklists
   - Example: `scrum.pmo/project.journal/2025-10-20-UTC-1008-session/*.pdca.md`

2. **Component-Specific:** `components/*/session/` directories
   - Component development PDCAs and session journals
   - Example: `components/PDCA/0.3.0.0/session/2025-10-22-UTC-1503.pdca.md`
   - Rationale: These document component development process (CMM3 artifacts)

3. **File Type Detection:** Any file matching `*.pdca.md` pattern
   - Regardless of location within the repository
   - PDCA suffix indicates process artifact by convention
   - Excludes test fixtures (see 2.3 below)

**All Other Files:**
- Source code, tests, configuration, documentation
- Standard AGPL-3.0 WITH AI-GPL-Addendum terms apply
- Not classified as "process artifacts" but still copyleft
- Example: Component source code, README files, shell scripts

**Exclusions from Process Artifact Classification:**
- Test fixtures (`components/*/test/data/`)
- Generated code (`dist/`, `build/`)
- Third-party code (`node_modules/`)
- Binary files

### 2.3 Clarification: All Files Licensed, Not All Are "Process Artifacts"

**Important Distinction:**

- **All files** get AGPL-3.0 WITH AI-GPL-Addendum license
- **Process artifacts** are a subset with special business model significance
- **AI-GPL terms apply to all**, but "process artifacts" label highlights commercial value

## 3. AI Usage Rights

### 3.1 Copyleft for AI Training & Use

All software and process artifacts covered by this license remain under 
AGPLv3 copyleft terms when used for AI training, fine-tuning, or inference:

- **Training Data:** If used to train AI models, the trained model's outputs 
  must respect the AGPLv3 copyleft when they substantially reproduce the 
  licensed work
- **Inference Context:** If used as context/examples for AI systems (e.g., RAG, 
  few-shot learning), outputs must comply with AGPLv3 if they constitute 
  derivative works
- **Network Use:** AGPLv3 Section 13 applies: AI services using this software 
  must offer source code to network users

### 3.2 Process Artifacts: Dual-Licensing Available

For "process artifacts" as defined in Section 2:

- **Open Source Use:** Free under AGPLv3 for compliant use
- **Commercial AI Use:** Dual-licensing available for AI applications that 
  cannot comply with AGPLv3 copyleft terms
- **Contact:** licensing@ceruleancircle.com for commercial licensing inquiries

## 4. Rationale

### 4.1 Why This Addendum Exists

The AGPLv3 was written before the widespread use of AI in software development. 
This addendum clarifies:

1. **AI Training Clarity:** Whether AI training constitutes "use" or "derivative work"
2. **Process Value Recognition:** Human-AI collaborative methodologies have commercial value
3. **Dual-Licensing Model:** Enables open-source collaboration while protecting commercial interests

### 4.2 Alignment with AGPLv3 Philosophy

This addendum extends, but does not contradict, AGPLv3:

- **Copyleft Preserved:** All AI use respects copyleft principles
- **Network Use Enforced:** AGPLv3 Section 13 applies to AI services
- **Additional Permissions:** Dual-licensing is an additional permission, not a restriction
- **GPL Compatibility:** Maintains GPL family compatibility

## 5. Relationship to AGPLv3

This addendum is governed by AGPLv3's "Additional Terms" mechanism (Section 7). 

**If Conflict Arises:** AGPLv3 terms take precedence. This addendum only clarifies 
AI-specific scenarios not explicitly addressed in AGPLv3.

**Complete License:** The complete terms are:
```
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
```

## 6. Interpretation Guidance

### 6.1 Non-Exhaustive Examples

**Scenario:** AI company trains model on this repository's code and PDCAs

**Analysis:**
- **Training alone** is likely fair use (no distribution)
- **Model outputs** that substantially reproduce our code/processes must comply with AGPLv3
- **Offering model as network service** using our code triggers AGPL Section 13
- **Commercial process artifact use** may require dual-license (contact us)

**Scenario:** Developer uses our PDCAs as RAG context for coding assistant

**Analysis:**
- **Retrieval/reference** during development is fair use
- **Generated code** incorporating our copyrighted expressions must comply with AGPLv3
- **Internal use** complies if source is shared with users (AGPL Section 13)

**Scenario:** Company wants to use our PDCA methodology in proprietary AI product

**Analysis:**
- **Open-source AI product:** AGPLv3 compliance required, no dual-license needed
- **Proprietary AI product:** Contact us for commercial dual-license
- **Substantial modifications:** Still derivative work, copyleft applies

### 6.2 When in Doubt

**Default Position:** AGPLv3 copyleft applies  
**Commercial Inquiries:** licensing@ceruleancircle.com  
**Community Support:** https://ceruleancircle.com

## 7. Version History

- **v1.0 (2025-01-01):** Initial release
  - Establishes AI-specific terms for AGPLv3
  - Defines "process artifacts" and scope
  - Offers dual-licensing for commercial AI use

## 8. Contact & Licensing Inquiries

**Cerulean Circle GmbH**  
Homepage: https://ceruleancircle.com  
Email: licensing@ceruleancircle.com

**For Questions:**
- License interpretation
- Commercial dual-licensing
- Contribution agreements
- Partnership opportunities

---

**Legal Notice:** This addendum is provided as-is without warranty. For legal advice, 
consult a qualified attorney. This addendum aims to clarify, not complicate, the 
open-source licensing model while protecting the commercial value of process artifacts.

**"Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."**  
This license embodies the principle that AI works best with human collaboration, 
ensuring both parties benefit from shared innovation.

